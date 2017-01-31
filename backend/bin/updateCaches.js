const debug = require('debug')('express-sequelize');
const models = require('../models');
/* eslint-disable no-console */

let utils = require('.././utils');

function pushToKeyWithTS(object, thread_id, key, value, timestamp) {
  object[thread_id] = object[thread_id] ? object[thread_id] : {};
  object[thread_id][key] = object[thread_id][key] ? object[thread_id][key] : [];
  object[thread_id][key].push({value, timestamp});
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
  messages.map(message => {
    let d = JSON.parse(message.log_message_data);
    let raw = JSON.parse(message.raw);
    let timestamp = message.timestamp;
    let thread_id = message.thread_id;
    let type;
    if(d.added_participants != null) {
      type = "added_participants";
    }
    else if(d.removed_participants != null) {
      type = "removed_participants";
    }
    else if(d.transfer_id != null) {
      type = "transfer";
    }
    else if(d.name != null) {
      type = "name";
      data = pushToKeyWithTS(data,thread_id,type,d.name,timestamp);
    }
    else if(d.message_type=="change_thread_nickname") {
      type = d.message_type;
    }
    else if(d.message_type=="bot_thread_subscription") {
      type = d.message_type;
    }
    else if(d.message_type=="change_thread_icon") {
      type = d.message_type;
    }
    else if(d.message_type=="change_thread_theme") {
      type = d.message_type;
    }
    else if(d.message_type=="game_score") {
      type = d.message_type;
    }
    else if(d.message_type=="instant_game_update") {
      type = d.message_type;
    }
    else if(d.message_type=="group_poll") {
      type = d.message_type;
    }
    else if(d.message_type=="rtc_call_log") {
      type = d.message_type;
    }
    else if(d.message_type=="journey_prompt_bot" || d.message_type=="journey_prompt_color") {
      type = d.message_type;
    }
    else if(d.message_type && d.message_type.includes("lightweight_event")) {
      type="lightweight_event";
    }
    else if(raw.log_message_type=="log:phone-call")
      type = "call";
    else if('image' in d) {
      type = "image";
    }
    if(!type)
    {
      console.log(message.thread_id, message.message_id);
      console.log(d);
      console.log(d.untypedData);
      console.log(d.message_type);
      console.log("------------");
    }
  });
  console.log(JSON.stringify(data));
});
