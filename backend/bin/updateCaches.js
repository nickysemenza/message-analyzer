const debug = require('debug')('express-sequelize');
const models = require('../models');

models.sequelize.sync().then(function() {

  models.FacebookThread.findAll().then(threads => {
    for(let a in threads) {
      // let people = JSON.parse(threads[a].participant_ids);
      let threadID = threads[a].thread_id;
      console.log("thread "+threadID);

      models.FacebookMessage.count({ where: {thread_id: threadID} }).then(function(c) {
        models.FacebookThread.update(
          { downloaded_message_count: c },
          { where: { thread_id: threadID } }
        )
      });

    }
  }).then(a => {console.log("done",a)});

  //i want to do something here once all my code has finished

});
