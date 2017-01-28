let models  = require('../models');
let express = require('express');
let router  = express.Router();


router.get('/', function(req, res) {
  models.FacebookUser.findAll()
    .then(function(users) {
    res.json(users);
  });
});

router.get('/:user_id/threads', (req, res) => {
  console.log(req.params);
  models.FacebookThread.findAll().then(threads => {
    let threadList = [];
    for(let a in threads) {
      let people = JSON.parse(threads[a].participant_ids);
      if(people.indexOf(req.params.user_id)!=-1) {
        threadList.push(threads[a]);
      }
    }
    res.send(threadList);
  });
});

module.exports = router;
