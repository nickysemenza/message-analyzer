from dotenv import load_dotenv, find_dotenv
import os
from sqlalchemy import create_engine, update
load_dotenv(find_dotenv())
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

#Connect to MySQL
engine = create_engine("mysql+pymysql://"
	+os.environ.get("mysql_user")
	+":"+os.environ.get("mysql_password")
	+"@"+os.environ.get("mysql_host")
	+"/"+os.environ.get("mysql_database")+"?charset=utf8mb4")

conn = engine.connect()

me = "fbid:1529367683"

groupchat_threads = conn.execute("select thread_id from facebook_threads where num_participants > 2").fetchall()
groupchat_threads = [x[0] for x in groupchat_threads]
groupchat_threads = ','.join(groupchat_threads)

sql_base="select timestamp from facebook_messages where"
sql_addon=""
sql_addon+=" and timestamp > 1356998400"

res_sent = conn.execute(sql_base+" sender_id = '"+me+"' and thread_id not in ("+groupchat_threads+")"+sql_addon).fetchall()
res_recv = conn.execute(sql_base+" sender_id != '"+me+"' and thread_id not in ("+groupchat_threads+")"+sql_addon).fetchall()

res_sent_groupchat = conn.execute(sql_base+" sender_id = '"+me+"' and thread_id in ("+groupchat_threads+")"+sql_addon).fetchall()
res_recv_groupchat = conn.execute(sql_base+" sender_id != '"+me+"' and thread_id in ("+groupchat_threads+")"+sql_addon).fetchall()


# print(res_sent_groupchat)
# sadboyz = conn.execute(sql_base+" thread_id = '869042309831501'"+sql_addon).fetchall()


#build a numpy array of integers from the sql strings, then convert to datetime
column_sent = 			np.array([int(x[0]) for x in res_sent]).astype('datetime64[s]')
column_recv = 			np.array([int(x[0]) for x in res_recv]).astype('datetime64[s]')
column_sent_groupchat = np.array([int(x[0]) for x in res_sent_groupchat]).astype('datetime64[s]')
column_recv_groupchat = np.array([int(x[0]) for x in res_recv_groupchat]).astype('datetime64[s]')
# sadboyz = 				np.array([int(x[0]) for x in sadboyz]).astype('datetime64[s]')




#dataframe for counting sent, solo
df = pd.DataFrame({'ts': column_sent})
df['year'] = df['ts'].dt.year
df_sent_count = df.groupby(by=['year']).count()#.plot(kind="bar")
df_sent_count.columns = ['sent: solo']


#dataframe for counting received, solo
df = pd.DataFrame({'ts': column_recv})
df['year'] = df['ts'].dt.year
df_recv_count = df.groupby(by=['year']).count()
df_recv_count.columns = ['received: solo']


#dataframe for counting sent, groupchat
df = pd.DataFrame({'ts': column_sent_groupchat})
df['year'] = df['ts'].dt.year
df_sent_count_groupchat = df.groupby(by=['year']).count()
df_sent_count_groupchat.columns = ['sent: group']

#dataframe for counting received, groupchat
df = pd.DataFrame({'ts': column_recv_groupchat})
df['year'] = df['ts'].dt.year
df_recv_count_groupchat = df.groupby(by=['year']).count()
df_recv_count_groupchat.columns = ['received: group']


#overlay the two charts
merged = pd.concat([df_sent_count,df_recv_count,df_recv_count_groupchat,df_sent_count_groupchat],axis=1)
merged.plot(kind="bar")

print(merged)


df_sent_count.columns = ['sent total']
df_sent_count_groupchat.columns = ['sent total']
a = df_sent_count.add(df_sent_count_groupchat, fill_value=0)
print(a)
# print(df.merge(df_sent_count,df_sent_count_groupchat))
# plt.show()
