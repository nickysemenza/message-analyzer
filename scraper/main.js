var login = require("facebook-chat-api");
var fs    = require("fs");
var mysql      = require('mysql');
var connection = mysql.createConnection(require('./settings').mysql);

connection.connect();

function test(api) {
	console.log('test');
    // api.getThreadHistory("869042309831501", 0, 10, null, function(err, history)
    // {
    //     if(err) return console.error(err);
    //     console.log(history[1]);
    // });
}

/**
* gets your friends list, and saves it to the DB so you can do a fbid->name lookout without making an API call
*/
function updateFriendsList(api) {
	api.getFriendsList(function(err, data) {
	    if(err) return console.error(err);

	    console.log(data.length+" friends");

	    for(var x in data) {
			var each = data[x];
		    saveFacebookUser(each);
		}
  	});
}
/**
* saves a facebook user object into the facebook_users tble
* (this is just a helper function, not meant to be called directly)
*/
function saveFacebookUser(each) {
	var dbdata = {
				facebook_id: each.userID,
				first_name: each.firstName,
				full_name: each.fullName,
				raw: JSON.stringify(each)
			};

		    var query = connection.query('INSERT INTO facebook_users SET ?', dbdata, function(err, result) {
				if(err) {
					if(err.code != "ER_DUP_ENTRY")
					console.log(err);
				}
			});
}
/**
* updates the facebook_threads table with all of your message threads
* 	this works in batches of 1000, and is faux-recursive, call it with:
* 	updateThreadsList(api, 0, 1000); and it will go through them all
*/
function updateThreadsList(api, start, end) {
	 api.getThreadList(start, end, function callback(err, arr) {
	 	var requestedCount = (end-start);
	 	var returnedCount = arr.length;
	 	console.log("requested "+start+"->"+end+"("+requestedCount+") threads, got "+returnedCount+" threads");
	 	if(requestedCount==returnedCount)//if not on the last page of results, there will be a full page of 1000
	 		updateThreadsList(api,start+1000,end+1000)
	 	else
	 		console.log('we done');
    	for(var x in arr) {
    		var each = arr[x];
    		// console.log(each);
    		var dbdata  = { 
    			thread_id: each.threadID,
    			name: each.name,
    			message_count: each.messageCount,
    			participant_ids: JSON.stringify(each.participantIDs),
    			raw: JSON.stringify(each.original)
    		};
			var query = connection.query('INSERT INTO facebook_threads SET ?', dbdata, function(err, result) {});
    	}
    })
}
/*
* Will update all the history for a given thread
* 	this works in batches of 10000, and is faux-recursive, call it with:
* 	updateThreadDetail(api, THREAD_ID, 0,10000, null); and it will go through them all
*/
function updateThreadDetail(api, thread, start, end, ts) {
	api.getThreadHistory(thread, start, end, ts, function callback(err, hist) {
		var requestedCount = (end-start);
	 	var returnedCount = hist.length;
	 	console.log("[updateThreadDetail - "+thread+"] requested "+start+"->"+end+"("+requestedCount+") messages(timestamp="+ts+"), got "+returnedCount+" messages");
	 	//if we are returned less than requested, that we done

	 	if(requestedCount==(returnedCount-1))//TODO: why is hist always 1001 messages?
	 		updateThreadDetail(api,thread,start,end,hist[0].timestamp);//uses timestamps not start/end to batch
	 	else
	 		console.log("[updateThreadDetail - "+thread+"] we done");

	 	console.log(hist[0].messageID);
		for(var x in hist) {
			var each = hist[x];
			var dbdata = {
				type: each.type,
				sender_name: each.senderName,
				sender_id: each.senderID,
				body: each.body,
				thread_id: each.threadID,
				message_id: each.messageID,
				attachments: JSON.stringify(each.attachments),
				timestamp: String(each.timestamp).slice(0, -3),
				raw: JSON.stringify(each)
			};
			var query = connection.query('INSERT INTO facebook_messages SET ?', dbdata, function(err, result) {
				if(err) {
					if(err.code != "ER_DUP_ENTRY")
					console.log(err);
				}
			});
		}
	})
}
/**
* this is like updateFriendsList, except it brings in user objects for people you have been in messages with,
* but who are not your friends
*/

function updatePeopleList(api) {

	connection.query('SELECT * FROM facebook_threads', function(err, rows, fields) {
	    if (err) throw err;
		var other_thread_participants = [];
	    for (var i in rows) {
	    	var each = rows[i];
	        	var people = JSON.parse(each.participant_ids);
	        	for(var a in people) {
	        		var person = people[a];
	        		other_thread_participants.push(person);
	        	}
	    }
	    console.log("you have been in threads with "+uniq(other_thread_participants).length+" people");

	    api.getUserInfo(uniq(other_thread_participants), function(err, data) {
		    if(err) return console.error(err);
		    console.log(Object.keys(data).length+" people returned from API");
		    for (var key in data) {
			  if (data.hasOwnProperty(key)) {
			    data[key].userID = key;
			    data[key].fullName = data[key].name;//hacky..meh
			    saveFacebookUser(data[key]);
			  }
			}
	  	});
	});
}

function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, function callback (err, api) {
    if(err) return console.error(err);
    // test(api);
   	// updateThreadsList(api, 0, 1000);
    //updateFriendsList(api);
    updateThreadDetail(api, "869042309831501", 0,10000, null);
    // updatePeopleList(api);
});




