const debug = require('debug')('express-sequelize');
const models = require('../models');
/* eslint-disable no-console */

let utils = require('.././utils');


let a = utils.updateUserMessageCounts();

// let chatCounts = utils.updateChatCounts();
let hint = utils.hintThreadNames();
  Promise.all([a,hint]).then(() => {
    console.log("done");
    process.exit(0);
  });

