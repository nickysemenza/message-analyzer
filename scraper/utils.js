var mysql = require('mysql');

require('dotenv').config({path: '../.env'});

var connection = mysql.createConnection(
{
	  host     : process.env.mysql_host,
	  user     : process.env.mysql_user,
	  password : process.env.mysql_password,
	  database : process.env.mysql_database,
	  charset  : 'utf8mb4'
	});

connection.connect();
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
	var deletequery = connection.query('DELETE from facebook_threads', function(err, result) {});
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
					else {
						console.log("bye");
						return;
					}
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


module.exports = {
    updateFriendsList: updateFriendsList,
	updateThreadsList: updateThreadsList,
	updateThreadDetail: updateThreadDetail,
	updatePeopleList: updatePeopleList
};