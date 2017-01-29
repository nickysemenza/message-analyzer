let models  = require('../models');
let express = require('express');
let router  = express.Router();

let kue = require('kue')
  , queue = kue.createQueue();


router.get('/', (req, res) => {
  models.FacebookThread.findAll()
    .then(threads => {
      res.json(threads);
    });
});
router.get('/:thread_id/messages', (req, res) => {
  models.FacebookMessage.findAll({
    where: {
      thread_id: req.params.thread_id
    }
  }).then(thread => {
    // let job = queue.create('thread-download', {
    //   thread_id: req.params.thread_id}).save( function(err){
    //   if( !err ) console.log( job.id );
    // });
    res.send(thread.slice(0,9999));
  });
});

router.get('/:thread_id/stats', (req, res) => {
  models.FacebookMessage.findAll({
    where: {
      thread_id: req.params.thread_id
    }
  }).then(thread => {
    // let times = thread.map(item =>{ return {timestamp: item.timestamp, name: item.sender_name}});
    let counts = {};
    thread.forEach(msg => {
      counts[msg.sender_name] = ++counts[msg.sender_name] || 1;
    });
    res.send({count: thread.length, counts});
  });
});

module.exports =  router;
