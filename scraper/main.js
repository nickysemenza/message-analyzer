/* eslint-disable no-console */

let login = require("facebook-chat-api");
let fs    = require("fs");
let utils = require('./utils');

let kue = require('kue')
  , queue = kue.createQueue();

// var job = queue.create('thread-download', {
//   thread_id: '1116429422'}).save( function(err){
//   if( !err ) console.log( job.id );
// });

login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);
    // utils.updateFriendsList(api).then(a=>{console.log('friend list updated: ',a)});
    // utils.updatePeopleList(api).then(a=>{console.log('people list updated: ',a)});
    // utils.updateThreadsList(api).then(a=>{console.log('thread list updated: ',a)});

    utils.updateThreadHistory(api, "100000154295985")
    // utils.updateThreadHistory(api, "838812462886665")
      .then(a=>{console.log('thread updated',a);}).catch(a=>console.log('oops',a));
    //
    //
    // queue.process('thread-download', function(job, done){
    //   pullThread(job.data.thread_id, done);
    // });
    //
    // function pullThread(thread_id, done) {
    //   utils.updateThreadHistory(api, thread_id).then(()=>{done();});
    // }

    // utils.downloadAllThreads(api);
    // setInterval( function() { console.log("setint"); utils.downloadAllThreads(api); }, 24000 );




});




