const debug = require('debug')('express-sequelize');
const models = require('../models');
/* eslint-disable no-console */

let utils = require('.././utils');


// let a = utils.updateFacebookThreadStats();
// let hint = utils.hintThreadNames();


  Promise.all([hint]).then(() => {
    console.log("done");
    process.exit(0);
  });

