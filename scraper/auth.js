let login = require("facebook-chat-api");
let fs    = require("fs");
require('dotenv').config({path: '../.env'});

let creds = {
		email: process.env.facebook_email,
		password: process.env.facebook_password
	};
login(creds, (err, api) => {
    if(err) return console.error(err);
    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
});
