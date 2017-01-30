// node --max-old-space-size=4096 bin/processAttachments.js
const models = require('../models');
let utils = require('.././utils');
let fs = require('fs'),
  request = require('request');
const md5File = require('md5-file/promise');


function processAttachments() {
  return new Promise((resolve, reject) => {
    models.FacebookMessage.findAll({}).then(msgs => {
      // msgs = msgs.slice(0,999);
      console.log("DB loaded into memory...");
      let messagesPromises = msgs.map(msg => {
        return new Promise((resolve, reject) => {
          const attachments = JSON.parse(msg.attachments);
          if (attachments.length > 0) {
            // console.log("----------"+msg.message_id);
            // console.log(attachments.length+ " attachments");
            let all = attachments.map((att, index) => utils.saveAttachment(msg.message_id, msg.thread_id, index, att));
            Promise.all(all).then(() => {
              resolve()
            });
          } else {
            resolve();
          }
        })
      });
      Promise.all(messagesPromises).then(() => {
        resolve();
      })
    });

  })
}

hashAttachmentFiles().then(() => {
  console.log("all attachments hashed")
});
// processAttachments().then(()=>{console.log("all attachments processed")});
// downloadAllAttachments().then(()=>{console.log("all attachments downloaded")});

function downloadAllAttachments() {
  return new Promise((resolveM, rejectM) => {
    models.FacebookAttachment.findAll({
      where: {
        filename: null
      }
    }).then(atts => {
      // atts = atts.slice(0,100);
      let p = atts.map((attachment, index) => {
        return new Promise((resolve, reject) => {
          if (attachment.url && attachment.filename == null) {
            let ext = attachment.url.match(/\.([^\./\?]+)($|\?)/)[1];
            let filename = "images/facebook_attachments/" + attachment.hash + "." + ext;
            setTimeout(() => {
              request(attachment.url)
                .on('error', (e) => {
                  console.log("fail", attachment.id, e);
                  resolve(e)
                })
                .pipe(fs.createWriteStream(filename))
                .on('close', () => {
                  attachment.update({
                    filename
                  })
                    .then(() => {
                      resolve();
                    });
                }, Math.sqrt(index * 100));
            })
          } else
            resolve();
        });
      });

      Promise.all(p).then(() => {
        console.log("done!");
        resolveM();
      });
    });
  });
}

function hashAttachmentFiles() {
  return new Promise((resolveM, rejectM) => {
    models.FacebookAttachment.findAll({
      where: {
        filename: {
          $ne: null
        },
        file_hash: null
      }
    }).then(atts => {
      let hashing = atts.map(attachment => {
        return new Promise((resolve, reject) => {
          md5File(attachment.filename).then(file_hash => {
            // console.log(`The MD5 sum of ${attachment.filename} is: ${file_hash}`);
            attachment.update({
              file_hash
            })
              .then(() => {
                resolve();
              });
          }).catch((hash_error) => {
            resolve(hash_error)
          });
        })
      });
      Promise.all(hashing).then(() => {
        resolveM()
      });
    });
  });
}
