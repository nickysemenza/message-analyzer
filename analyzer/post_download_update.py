#Updates downloaded_message_count
from dotenv import load_dotenv, find_dotenv
import os
from sqlalchemy import create_engine, update
# import pymysql.cursors
load_dotenv(find_dotenv())
import logging

#Connect to MySQL
engine = create_engine("mysql+pymysql://"
	+os.environ.get("mysql_user")
	+":"+os.environ.get("mysql_password")
	+"@"+os.environ.get("mysql_host")
	+"/"+os.environ.get("mysql_database")+"?charset=utf8mb4")

conn = engine.connect()

for x in conn.execute("""SELECT DISTINCT thread_id,
                         COUNT(thread_id) AS subtotal
                         FROM facebook_messages
                         GROUP BY thread_id
                         ORDER BY subtotal DESC
                      """).fetchall():
    conn.execute("UPDATE `facebook_threads` SET `downloaded_message_count` = '"+str(x['subtotal'])+"' WHERE `thread_id` = '"+str(x['thread_id'])+"'");
print "downloaded_message_count updated!"