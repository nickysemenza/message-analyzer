const debug = require('debug')('express-sequelize');
const models = require('../models');
const Promise = require("bluebird");
/* eslint-disable no-console */

models.sequelize.sync().then(() => {

  models.FacebookThread.findAll().then(threads => {
    // threads = threads.slice(0,3);

    let allThreadsPromise = threads.map(eachThread => {
      return new Promise((resolve, reject) => {
        let threadID = eachThread.thread_id;
        models.FacebookMessage.count({ where: {thread_id: threadID} })
        .then(count => {
          models.FacebookThread.update(
            { downloaded_message_count: count },
            { where: { thread_id: threadID } }
          )
          .then(result => resolve([eachThread.thread_id,count, result]));
        });
      });

    });
    Promise.all(allThreadsPromise).then(a => {console.log("done1",a.length); process.exit(0);});
  });


});
