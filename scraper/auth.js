var login = require("facebook-chat-api");
var fs    = require("fs");
require('dotenv').config({path: '../.env'});

var creds = {
		email: process.env.facebook_email,
		password: process.env.facebook_password
	};
login(creds, function callback (err, api) {
    if(err) return console.error(err);
    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
});
