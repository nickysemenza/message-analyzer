var login = require("facebook-chat-api");
var fs    = require("fs");
var utils = require('./utils');

login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, function callback (err, api) {
    if(err) return console.error(err);
   	utils.updateThreadsList(api, 0, 1000);
});