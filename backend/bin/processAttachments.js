// node --max-old-space-size=4096 bin/processAttachments.js
const models = require('../models');
let utils = require('.././utils');



// models.FacebookMessage.findAll({}).then(msgs => {
//   // msgs = msgs.slice(0,999);
//   console.log("DB loaded into memory");
//   let messagesPromises = msgs.map(msg=>{
//     return new Promise((resolve, reject) => {
//       const attachments = JSON.parse(msg.attachments);
//       if(attachments.length > 0) {
//         // console.log("----------"+msg.message_id);
//         // console.log(attachments.length+ " attachments");
//         let all = attachments.map((att,index)=>utils.saveAttachment(msg.message_id, msg.thread_id, index, att));
//         Promise.all(all).then(()=>{resolve()});
//       }
//       else {
//         resolve();
//       }
//     })
//   });
//   Promise.all(messagesPromises).then(()=>{
//     console.log("done!");
//   })
// });
let fs = require('fs'),
  request = require('request');

models.FacebookAttachment.findAll({
  where: {
    filename: null
  }
}).then(atts => {
  atts = atts.slice(0,100);
  let p = atts.map(attachment => {
    return new Promise((resolve, reject) => {
      if(attachment.url) {
        let ext = attachment.url.match(/\.([^\./\?]+)($|\?)/)[1];
        let filename = "facebook_attachments/"+attachment.hash+"."+ ext;
        request(attachment.url).pipe(fs.createWriteStream(filename)).on('close', () => {
          console.log("done");
          attachment.update({filename}).then(()=>{resolve();});
        });
      }
      else
        resolve();
    });
  });

  Promise.all(p).then(()=>{
    console.log("done!");
  });
});
