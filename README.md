#Facebook Messenger Chat History Downloader

##Howto
1. clone, cd into directory
2. npm install
3. `cp settings.example.js settings.js`, add your own credentials for FB and mysql
4. `node auth.js` to auth with facebook and save the state in `appstate.json` (only need to do this once until the cookies expire)
5. create the SQL tables (schema below, note that utf8mb4 is important for things like emoji)
6. Scroll down to the end of main.js and run your code from within login method


##SQL Schema
```
CREATE TABLE `facebook_messages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
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
```

```
CREATE TABLE `facebook_threads` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `thread_id` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `name` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `message_count` int(11) DEFAULT NULL,
  `participant_ids` text CHARACTER SET utf8,
  `raw` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `thread_id` (`thread_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3079 DEFAULT CHARSET=utf8mb4;
```

```
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