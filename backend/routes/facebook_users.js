let models  = require('../models');
let express = require('express');
let router  = express.Router();


router.get('/', function(req, res) {
  models.FacebookUser.findAll()
    .then(function(users) {
    res.json(users);
  })
});
module.exports = router;
