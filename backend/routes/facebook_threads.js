let models  = require('../models');
let express = require('express');
let router  = express.Router();


router.get('/', (req, res) => {
  models.FacebookThread.findAll()
    .then(threads => {
      res.json(threads);
    });
});

// router.post('/create', function(req, res) {
//   models.User.create({
//     username: req.body.username
//   }).then(function() {
//     res.redirect('/');
//   });
// });
//
router.get('/:thread_id/messages', (req, res) => {
  console.log(req.params);
  models.FacebookMessage.findAll({
    where: {
      thread_id: req.params.thread_id
    }
  }).then(thread => {
    res.send(thread);
  });
});

//
// router.post('/:user_id/tasks/create', function (req, res) {
//   models.Task.create({
//     title: req.body.title,
//     UserId: req.params.user_id
//   }).then(function() {
//     res.redirect('/');
//   });
// });
//
// router.get('/:user_id/tasks/:task_id/destroy', function (req, res) {
//   models.Task.destroy({
//     where: {
//       id: req.params.task_id
//     }
//   }).then(function() {
//     res.redirect('/');
//   });
// });


module.exports =  router;
