// node --max-old-space-size=4096 bin/influxImport.js
const models = require('../models');
const Influx = require('influx');
const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'messages',
  schema: [
    {
      measurement: 'chat_message',
      fields: {
        person: Influx.FieldType.STRING,
        thread: Influx.FieldType.STRING,
        message_id: Influx.FieldType.STRING
      },
      tags: [
        'thread_id','facebook_user_id'
      ]
    }
  ]
});


models.FacebookMessage.findAll({}).then(msgs => {
  // msgs = msgs.slice(0,999);
  console.log('importing into influxDB...');
  let inserts = msgs.map(msg=>{
    return {
      measurement: 'chat_message',
      tags: { thread_id: msg.thread_id, facebook_user_id: msg.sender_id },
      fields: { person: msg.sender_name, thread: msg.thread_id, message_id: msg.message_id },
      timestamp: new Date(msg.timestamp*1000)
    };});
  influx.writePoints(inserts).then(()=>{console.log('done');}).catch((e)=>{console.log('eek',e);});
});
