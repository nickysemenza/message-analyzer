let models  = require('../models');
let express = require('express');
let router  = express.Router();

router.get('/', (req, res) => {
  res.json("hi");
});

module.exports = router;
