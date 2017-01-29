#Facebook Messenger Chat History Downloader/ Analyzer

This project consists of a few parts / 'modules'
* Scraper (node.js) that downloads facebook messages into MySQL
* Analyzer (python) that does data processing
* Web (React.js) that displays data nicely

The Scraper code can work on its own if desired.

##Howto run the scraper
1. clone, cd into project repo
2. `cp .env.example .env`, add your own credentials for Facebook and MySQL
3. `cd scraper; npm install`
4. `node auth.js` to auth with facebook and save the state in `appstate.json` (only need to do this once until the cookies expire)
5. create the SQL tables (schema below, note that utf8mb4 is important for things like emoji)
6. Scroll down to the end of scraper.js and run your code from within login method!

##SQL Schema
```
CREATE TABLE `facebook_messages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sender_name` varchar(25) CHARACTER SET utf8 DEFAULT NULL,
  `sender_id` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `body` text,
  `thread_id` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `message_id` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `attachments` text,
  `timestamp` varchar(20) CHARACTER SET utf8 DEFAULT '',
  `raw` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `message_id` (`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=264923 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `facebook_threads` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `thread_id` varchar(255) NOT NULL DEFAULT '',
  `name` varchar(999) DEFAULT NULL,
  `message_count` int(11) DEFAULT NULL,
  `downloaded_message_count` int(11) DEFAULT '0',
  `participant_ids` text,
  `num_participants` int(11) DEFAULT NULL,
  `raw` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `thread_id` (`thread_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14601 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `facebook_users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `facebook_id` varchar(100) DEFAULT NULL,
  `raw` text,
  `first_name` varchar(100) DEFAULT NULL,
  `full_name` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `facebook_id` (`facebook_id`)
) ENGINE=InnoDB AUTO_INCREMENT=998 DEFAULT CHARSET=utf8mb4;
```

#TODO
* [ ] make script automatically download all your threads in a loop
* [ ] add support for other metadata (changing emoji/color/title) -requires tweaking facebook-chat-api
* [ ] stop downloading a thread when there are back to back sql duplicate errors, this can be a hacky way of getting a delta update of a thread since the last time we downloaded it
* [ ] chat titles for 1:1 convos are blank, so maybe have a script hint them based on fbid->name lookup and update that title value for 1:1 threads
