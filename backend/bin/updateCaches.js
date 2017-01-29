const debug = require('debug')('express-sequelize');
const models = require('../models');
/* eslint-disable no-console */

let utils = require('.././utils');


// let chatCounts = utils.updateChatCounts();
let hint = utils.hintThreadNames();
  Promise.all([hint]).then(() => {
    process.exit(0);
  });

