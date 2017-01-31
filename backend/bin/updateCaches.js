const debug = require('debug')('express-sequelize');
const models = require('../models');

const bluebird = require('bluebird');
let Promise = require('bluebird');

let redis = require("redis"),
  client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let utils = require('.././utils');

processThreadActions().then(()=>{process.exit(0);});

/**
 * Process thread actions, such as nickname changes, emoji changes, etc.
 * Saves a time-sorted log of these actions per-thread, into redis
 *
 */
function processThreadActions() {
  return new Promise((resolveP, rejectP) => {
    function pushToKeyWithTS(object, thread_id, key, value, timestamp) {
      let date = new Date(timestamp*1000);
      object[thread_id] = object[thread_id] ? object[thread_id] : {};
      object[thread_id][key] = object[thread_id][key] ? object[thread_id][key] : [];
      object[thread_id]["all"] = object[thread_id]["all"] ? object[thread_id]["all"] : [];
      object[thread_id][key].push({value, timestamp, date});
      object[thread_id]["all"].push({type: key, value, timestamp, date});
      return object;
    }

    models.FacebookMessage.findAll({
      where: {
        log_message_data: {
          $ne: null
        }
      },
      order: [['timestamp','ASC']]
    }).then(messages => {
      let data = {};
      // messages = messages.slice(0,9900);
      let p = messages.map(message => {
        return new Promise((resolve, reject) => {
          let d = JSON.parse(message.log_message_data);
          let raw = JSON.parse(message.raw);
          let timestamp = message.timestamp;
          let thread_id = message.thread_id;
          let type;
          if (d.added_participants != null) {
            type = "added_participants";
            //todo...[0]
            utils.getNameFromFacebookID(d.added_participants[0].substr(5)).then(user => {
              data = pushToKeyWithTS(data, thread_id, type,
                {
                  added: user,
                  added_by: message.sender_name
                }, timestamp);
              resolve();
            });
          }
          else if (d.removed_participants != null) {
            type = "removed_participants";
            utils.getNameFromFacebookID(d.removed_participants[0].substr(5)).then(user => {
              data = pushToKeyWithTS(data, thread_id, type,
                {
                  removed: user,
                  removed_by: message.sender_name
                }, timestamp);
              resolve();
            });
          }
          else if (d.transfer_id != null) {
            type = "transfer";
            resolve();
          }
          else if (d.name != null) {
            type = "name";
            data = pushToKeyWithTS(data, thread_id, type, {name: d.name, changed_by: message.sender_name}, timestamp);
            resolve();
          }
          else if (d.message_type == "change_thread_nickname") {
            type = d.message_type;
            utils.getNameFromFacebookID(d.untypedData.participant_id).then(nicked => {
              data = pushToKeyWithTS(data, thread_id, type,
                {
                  nickname: d.untypedData.nickname,
                  nicked,
                  nick_changed_by: message.sender_name
                }, timestamp);
              resolve();
            });

          }
          else if (d.message_type == "bot_thread_subscription") {
            type = d.message_type;
            resolve();
          }
          else if (d.message_type == "change_thread_icon") {
            type = d.message_type;
            data = pushToKeyWithTS(data, thread_id, type, {icon: d.untypedData.thread_icon, changed_by: message.sender_name}, timestamp);
            console.log(d.untypedData.thread_icon);
            resolve();
          }
          else if (d.message_type == "change_thread_theme") {
            type = d.message_type;
            data = pushToKeyWithTS(data, thread_id, type, {color: d.untypedData.theme_color, changed_by: message.sender_name}, timestamp);
            resolve();
          }
          else if (d.message_type == "game_score") {
            type = d.message_type;
            resolve();
          }
          else if (d.message_type == "instant_game_update") {
            type = d.message_type;
            resolve();
          }
          else if (d.message_type == "group_poll") {
            type = d.message_type;
            resolve();
          }
          else if (d.message_type == "rtc_call_log") {
            type = d.message_type;
            resolve();
          }
          else if (d.message_type == "journey_prompt_bot" || d.message_type == "journey_prompt_color") {
            type = d.message_type;
            resolve();
          }
          else if (d.message_type && d.message_type.includes("lightweight_event")) {
            type = "lightweight_event";
            resolve();
          }
          else if (raw.log_message_type == "log:phone-call") {
            type = "call";
            resolve();
          }
          else if ('image' in d) {
            type = "image";
            resolve();
          }
          else {
            console.log("eek");
            resolve();
          }
          // if (!type) {
          //   console.log(message.thread_id, message.message_id);
          //   console.log(d);
          //   console.log(d.untypedData);
          //   console.log(d.message_type);
          //   console.log("------------");
          // }
        });
      });
      Promise.all(p).then(()=>{

        let redis_insert = Object.keys(data).map((key, index) => {
          return new Promise((resolve, reject) => {
            let redisToInsert = [];
            Object.keys(data[key]).forEach((innerKey) => {
              redisToInsert.push("actions-"+innerKey);
              redisToInsert.push(JSON.stringify(data[key][innerKey]));//.substr(0,10));
            });
            // ["actions-all", JSON.stringify(data[key])]
            redisToInsert.push("actions-grouped");
            redisToInsert.push(JSON.stringify(data[key]));
            // console.log(redisToInsert);
            client.hmsetAsync("thread:"+key, redisToInsert).then(()=>{resolve();});
          });
        });
        Promise.all(redis_insert).then(()=>{console.log('yay'); resolveP();});
      });

    });
  });
}

