var login = require("facebook-chat-api");
var fs    = require("fs");
var utils = require('./utils');

var kue = require('kue')
  , queue = kue.createQueue();

var job = queue.create('thread-download', {
  thread_id: '1116429422'}).save( function(err){
  if( !err ) console.log( job.id );
});


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
   	// utils.updateThreadsList(api, 0, 1000);
    // utils.updateFriendsList(api);
    utils.updateThreadDetail(api, "1116429422", 0,10000, null);
    // utils.updateThreadDetail(api, "100001080090928", 0,10000, null);
    // utils.updatePeopleList(api);


    queue.process('thread-download', function(job, done){
      pullThread(job.data.thread_id, done);
    });

    function pullThread(thread_id, done) {
      // if(!isValidEmail(address)) {
      //   //done('invalid to address') is possible but discouraged
      //   return done(new Error('invalid to address'));
      // }
      utils.updateThreadDetail(api, thread_id, 0,10000, null);
      // email send stuff...
      done();
    }

    // utils.downloadAllThreads(api);
    // setInterval( function() { console.log("setint"); utils.downloadAllThreads(api); }, 24000 );




});




