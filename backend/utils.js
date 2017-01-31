let mysql = require('mysql');
/* eslint-disable no-console */
const models = require('./models');
const bluebird = require('bluebird');
let Promise = require('bluebird');

let redis = require("redis"),
  client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

require('dotenv').config({
  path: '../.env'
});

let connection = mysql.createConnection({
  host: process.env.mysql_host,
  user: process.env.mysql_user,
  password: process.env.mysql_password,
  database: process.env.mysql_database,
  charset: 'utf8mb4'
});

connection.connect();
/**
 * gets your friends list, and saves it to the DB so you can do a fbid->name lookout without making an API call
 */
function updateFriendsList(api) {
  return new Promise((resolve, reject) => {
    api.getFriendsList((err, data) => {
      if (err) reject(err);
      Promise.all(data.map(user=>saveFacebookUser(user))).then(()=>{resolve({num_friends: data.length});});
    });
  });
}
/**
 * saves a facebook user object into the facebook_users tble
 * (this is just a helper function, not meant to be called directly)
 */
function saveFacebookUser(each) {
  return new Promise((resolve, reject) => {
    let dbdata = {
      facebook_id: each.userID,
      first_name: each.firstName,
      full_name: each.fullName,
      raw: JSON.stringify(each)
    };

    connection.query('INSERT INTO facebook_users SET ?', dbdata, (err, result) => {
      if (err)
        if (err.code != "ER_DUP_ENTRY") reject(err);
      resolve();
    });
  });
}
/**
 * saves a facebook thread into the threads table (helper function)
 */
function saveFacebookThreadInfo(each) {
  return new Promise((resolve, reject) => {
    //todo: if data exists
    let dbdata = {
      thread_id: each.threadID,
      name: each.name,
      message_count: each.messageCount,
      downloaded_message_count: 0,
      participant_ids: JSON.stringify(each.participantIDs),
      num_participants: each.participantIDs.length,
      raw: JSON.stringify(each),
    };
    // console.log(dbdata);
    let query = connection.query('INSERT INTO facebook_threads SET ?', dbdata, (err, result) => {
      if (err) reject(err);
      resolve();
    });
  });
}
/**
 * updates the facebook_threads table with all of your message threads
 *   this works in batches of 1000, and is faux-recursive, call it with:
 *   updateThreadsList(api, 0, 1000); and it will go through them all
 */
function updateThreadsList(api) {
  return new Promise((resolve, reject) => {
    let deletequery = connection.query('DELETE from facebook_threads', (err, result) => {
      updateThreadsListRecur(api, 0, 1000, resolve, reject, 0);
    });

  });
}
function updateThreadsListRecur(api, start, end, resolve, reject, sum) {
  api.getThreadList(start, end, (err, arr) => {
    let requestedCount = (end - start);
    let returnedCount = arr.length;
    sum+=returnedCount;
    console.log("[updateThreadsListRecur] requested " + start + "->" + end + "(" + requestedCount + ") threads, got " + returnedCount + " threads");

    Promise.all(arr.map(threadInfo => saveFacebookThreadInfo(threadInfo))).then(()=>{
      if (requestedCount == returnedCount) //if not on the last page of results, there will be a full page of 1000
        updateThreadsListRecur(api, start + 1000, end + 1000, resolve, reject, sum);
      else {
        //we don't have more pages
        resolve({num_threads: sum});
      }
    });
  });
}
/*
 * Will update all the history for a given thread
 *   this works in batches of 10000, and is faux-recursive, call it with:
 *   updateThreadDetail(api, THREAD_ID, 0,10000, null); and it will go through them all
 */
function updateThreadHistory(api, thread) {
  return new Promise((resolve, reject) => {
    updateThreadDetail(api, thread, 0,10000, null, 0, resolve, reject);
  }).then(()=>{updateFacebookThreadStats();});
}
function updateThreadDetail(api, thread, start, end, ts, sum, resolve, reject) {
  api.getThreadHistory(thread, start, end, ts, (err, hist) => {
    let requestedCount = (end - start);
    if (hist == null)
      resolve();
    let returnedCount = hist.length;
    console.log("[updateThreadDetail - " + thread + "] requested " + start + "->" + end + "(" + requestedCount + ") messages(timestamp=" + ts + "), got " + returnedCount + " messages");

    sum+=returnedCount;

    Promise.all(hist.map(msg => saveThreadMessage(msg))).then(() => {
      console.log("all messages on this page saved");

      if (requestedCount == (returnedCount - 1)) //TODO: why is hist always 1001 messages?
        updateThreadDetail(api, thread, start, end, hist[0].timestamp, sum, resolve, reject); //uses timestamps not start/end to batch
      else {
        //if we are returned less than requested, then we are done
        console.log("[updateThreadDetail - " + thread + "] done");
        resolve({num_messages: sum});
      }
    });
  });
}
function saveThreadMessage(each) {
  return new Promise((resolve, reject) => {
    let dbdata = {
      sender_name: each.senderName,
      sender_id: each.senderID,
      body: each.body,
      thread_id: each.threadID,
      message_id: each.messageID,
      attachments: JSON.stringify(each.attachments),
      timestamp: String(each.timestamp).slice(0, -3),
      tags: JSON.stringify(each.tags),
      log_message_data: each.log_message_data ? JSON.stringify(each.log_message_data) : null,
      raw: JSON.stringify(each)
    };
    let query = connection.query('INSERT INTO facebook_messages SET ?', dbdata, (err, result) => {
      if (err) {
        if (err.code != "ER_DUP_ENTRY") {
          reject(err);//bad error
        }
        else {
          resolve({duplicate: true});
        }
      }
      else//good to go
        resolve({duplicate: false});
    });
  });
}
/**
 * this is like updateFriendsList, except it brings in user objects for people you have been in messages with,
 * but who are not your friends
 */

function updatePeopleList(api) {

  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM facebook_threads', (err, rows, fields) => {
      if (err) throw err;
      let other_thread_participants = [];
      for (let i in rows) {
        let each = rows[i];
        let people = JSON.parse(each.participant_ids);
        for (let a in people) {
          let person = people[a];
          other_thread_participants.push(person);
        }
      }
      api.getUserInfo(uniq(other_thread_participants), (err, data) => {
        if (err) return console.error(err);
        let savingPromises = Object.keys(data).map((key, index) => {
          if (data.hasOwnProperty(key)) {
            data[key].userID = key;
            data[key].fullName = data[key].name; //hacky..meh
            return saveFacebookUser(data[key]);
          }
        });
        Promise.all(savingPromises).then(()=>resolve({num_people: Object.keys(data).length}));
      });
    });
  });
}

function uniq(a) {
  let seen = {};
  return a.filter((item) => {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}


function downloadAllThreads(api) {
  let blacklist = ["1630448017222903", "1329843113706031", "869042309831501", "b847174376bd46a2919e5d93cd096f1f", "1WVMhEhEBihdAWEz7Rak/w", "id.257890450924306"];
  connection.query('select * from facebook_threads where message_count > downloaded_message_count order by message_count asc limit 7', (err, rows, fields) => {
    if (err) throw err;
    for (let i in rows) {
      let each = rows[i];
      let eachID = each.thread_id;
      if (blacklist.indexOf(eachID) == -1)
        updateThreadDetail(api, eachID, 0, 10000, null);


    }

  });
}

function getNameFromFacebookID(facebook_id) {
  return new Promise((resolve, reject) => {
    models.FacebookUser.find({
      where: {facebook_id}
    }).then(user => {resolve(user.full_name);});
  });
}

//backend shared helper functions
/**
 * updates chat counts and message counts
 */
function updateFacebookThreadStats() {
  return new Promise((resolve, reject)=>{
    Promise.all([updateNumFacebookMessagesDownloaded(),updateUserMessageCounts()]).then(()=>{resolve();});
  });
}
function updateNumFacebookMessagesDownloaded() {
  return new Promise((resolveO, reject) => {
    const countsQuery = 'SELECT DISTINCT thread_id, COUNT(thread_id) AS subtotal FROM facebook_messages GROUP BY thread_id ORDER BY subtotal DESC';
    models.sequelize.query(countsQuery).spread((results) => {
      let promises = results.map(result=>{
        return new Promise((resolve, reject) => {
          models.FacebookThread.update(
            { downloaded_message_count: result.subtotal },
            { where: { thread_id: result.thread_id } }
          ).then(updateResult => resolve(updateResult));
        });
      });
      Promise.all(promises).then(p => {console.log('downloaded_message_count updated'); resolveO(p);});
    });

  });
}

function updateUserMessageCounts() {
  return new Promise((resolve, reject)=> {

    const countsQuery = 'SELECT sender_name, thread_id, COUNT(sender_name) as num FROM facebook_messages GROUP BY sender_name, thread_id';
    models.sequelize.query(countsQuery).spread((results) => {
      let counts = {};
      results.forEach(row=>{
        if(!counts[row.thread_id]){
          counts[row.thread_id] = {};
        }

        let currVal = counts[row.thread_id][row.sender_name] ? counts[row.thread_id][row.sender_name] : 0;
        counts[row.thread_id][row.sender_name] = currVal+row.num;

      });

      let p = [];
      for(let key in counts) {
        p.push(client.hsetAsync("thread:"+key, ["stats", JSON.stringify(counts[key])]));
      }
      Promise.all(p).then(()=>{resolve();});
    });
  });
}

function hintThreadNames() {
  return new Promise((resolve, reject) => {
    models.FacebookThread.findAll().then(threads => {
      let p = threads.map(thread => {
        return Promise.all(JSON.parse(thread.participant_ids).map(p => getNameFromFacebookID(p))).then(namesArray=> {
          return new Promise((resolveU, rejectU) => {
            if(thread.name=='')
              thread.update({participant_names: JSON.stringify(namesArray), name: namesArray.join(' & ').substr(0,200)}).then(()=>{resolveU();});
            else
              thread.update({participant_names: JSON.stringify(namesArray)}).then(()=>{resolveU();});
          });
        });
      });
      //this is wrong..
      // Promise.all(p).then(() => {console.log("aaaa"); resolve();});
      setTimeout(()=>{resolve();},10*1000);
    });
  });
}

function saveAttachment(message_id, thread_id, sender_id, index, attachment) {
  return new Promise((resolve, reject) => {

    let url = null;
    if(attachment.url)
      url = attachment.url;
    else if(attachment.largePreviewUrl)
      url = attachment.largePreviewUrl;
    else if(attachment.previewUrl)
      url = attachment.previewUrl;


    models.FacebookAttachment.create({
      message_id,
      thread_id,
      user_id: sender_id,
      type: attachment.type,
      hash: message_id+"-"+index,
      sticker_id: attachment.type == 'sticker' ? attachment.stickerID : null,
      url,
      raw: JSON.stringify(attachment)
    }).then(() => {
      resolve();
    }).catch((e) => {resolve(e);});

  });
}

module.exports = {
  hintThreadNames,
  updateFacebookThreadStats,
  updateFriendsList,// used by scraper.js
  updateThreadsList,// used by scraper.js
  updatePeopleList,// used by scraper.js
  downloadAllThreads,
  updateThreadHistory,//used by scraper.js, main entry
  saveAttachment,
  getNameFromFacebookID,
};
