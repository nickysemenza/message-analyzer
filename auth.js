var login = require("facebook-chat-api");
var fs    = require("fs");
var creds = require("./settings").facebook;
login(creds, function callback (err, api) {
    if(err) return console.error(err);
    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
});
