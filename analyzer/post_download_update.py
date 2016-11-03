#Updates downloaded_message_count
from dotenv import load_dotenv, find_dotenv
import os
from sqlalchemy import create_engine, update
# import pymysql.cursors
load_dotenv(find_dotenv())
import logging
import json
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

def lookupUserByFbId(id):
    try: 
        return conn.execute("SELECT full_name from facebook_users WHERE facebook_id = "+str(id)).fetchall()[0][0].replace("'", "")
    except IndexError:
        return "n/a"


# for x in conn.execute("SELECT thread_id, name, participant_ids from facebook_threads").fetchall():
#     if(x['name']==""):
#         people_ids = json.loads(x['participant_ids'])
#         people_names = []
#         #print json.dumps(people, sort_keys=True,indent=4, separators=(',', ': '))
#         for pid in people_ids:
#             # print pid
#             people_names.append(lookupUserByFbId(pid))
#             # print lookupUserByFbId(pid)
#         namestring = ",".join(people_names)
#         conn.execute("UPDATE `facebook_threads` SET `name` = '"+namestring+"' WHERE `thread_id` = '"+str(x['thread_id'])+"'");

