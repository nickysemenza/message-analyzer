let login = require("facebook-chat-api");
let fs    = require("fs");
let prompt = require('prompt');
console.log("Enter your facebook email + password");
prompt.start();
prompt.get(['email', 'password'], function (err, result) {
  login(result, (err, api) => {
    if(err) return console.error(err);
    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
  });
});
