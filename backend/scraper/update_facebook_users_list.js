let login = require("facebook-chat-api");
let fs    = require("fs");
let utils = require('./utils');

login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);
    utils.updateFriendsList(api);
    utils.updatePeopleList(api);
});
