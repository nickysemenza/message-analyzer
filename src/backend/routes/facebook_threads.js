let models  = require('../models');
let express = require('express');
let router  = express.Router();

let kue = require('kue')
  , queue = kue.createQueue();
let redis = require("redis"),
  client = redis.createClient();
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

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
    res.send(thread.slice(0,9999));
  });
});

router.get('/:thread_id/download', (req, res) => {
  if(req.params.thread_id=="all") {
    let job = queue.create('thread-list-update')
      .save( (err) => {
        if( !err ) res.send({status: 'ok', job_id: job.id});
      });
  }
  else
  {
    let job = queue.create('thread-download', {
      thread_id: req.params.thread_id})
      .save( (err) => {
        if( !err ) res.send({status: 'ok', job_id: job.id});
      });
  }
});

router.get('/:thread_id/stats', (req, res) => {
  client.hgetAsync("thread:"+req.params.thread_id,'stats').then(a=>{
    res.send({counts: JSON.parse(a)});
  });
});

router.get('/:thread_id/actions/all', (req, res) => {
  client.hgetAsync("thread:"+req.params.thread_id,'actions-all').then(a=>{
    res.send({actions_all: JSON.parse(a)});
  });
});

module.exports =  router;
