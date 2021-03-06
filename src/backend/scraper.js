/* eslint-disable no-console */

let login = require("facebook-chat-api");
let fs    = require("fs");
let utils = require('./utils');
let emoji = require('node-emoji');
let kue = require('kue')
  , queue = kue.createQueue();

login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);

  queue.process('thread-list-update', (job, done) => {
      //update the 3 people and threads table
    Promise.all([
      utils.updateFriendsList(api),
      utils.updatePeopleList(api),
      utils.updateThreadsList(api)
    ]).then(a=>{
      console.log(a);
      Promise.all([utils.hintThreadNames(),utils.updateFacebookThreadStats()  ]).then(()=> {
        console.log(
          emoji.get('white_check_mark')+'  friends and people list updated\n' +
          emoji.get('white_check_mark')+'  thread list updated\n' +
          emoji.get('white_check_mark')+'  thread names hinted\n' +
          emoji.get('white_check_mark')+'  downloaded counts updated\n' +
          emoji.get('white_check_mark')+'  user message counts updated');
        done();
      });
    });
  });


  //now to tackle the messages
    // utils.updateThreadHistory(api, "869042309831501").then(a=>{console.log('thread updated',a);}).catch(a=>console.log('oops',a));

    queue.process('thread-download', (job, done) => {
      utils.updateThreadHistory(api, job.data.thread_id).then(()=>{done();});
    });
});




