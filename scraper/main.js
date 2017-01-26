var login = require("facebook-chat-api");
var fs    = require("fs");
var utils = require('./utils');
function test(api) {
	console.log('test');
    // api.getThreadHistory("869042309831501", 0, 10, null, function(err, history)
    // {
    //     if(err) return console.error(err);
    //     console.log(history[1]);
    // });
}

login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, function callback (err, api) {
    if(err) return console.error(err);
    // test(api);
   	utils.updateThreadsList(api, 0, 1000);
    //updateFriendsList(api);
    // utils.updateThreadDetail(api, "869042309831501", 0,10000, null);
    // utils.updateThreadDetail(api, "100001080090928", 0,10000, null);
    // updatePeopleList(api);


    // utils.downloadAllThreads(api);
    // setInterval( function() { console.log("setint"); utils.downloadAllThreads(api); }, 24000 );




});




