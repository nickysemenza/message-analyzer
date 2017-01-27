let models  = require('../models');
let express = require('express');
let router  = express.Router();

router.get('/', function(req, res) {
  res.json("hi");
});

module.exports = router;
