const debug = require('debug')('express-sequelize');
const models = require('../models');
/* eslint-disable no-console */

models.sequelize.sync().then(() => {

  const countsQuery = 'SELECT DISTINCT thread_id, COUNT(thread_id) AS subtotal FROM facebook_messages GROUP BY thread_id ORDER BY subtotal DESC';
  let updateChatCounts = new Promise((resolveO, reject) => {
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



  Promise.all([updateChatCounts]).then(() => {
    process.exit(0);
  });

});
