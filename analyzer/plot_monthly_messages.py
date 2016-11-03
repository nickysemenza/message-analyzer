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

res_sent = conn.execute("select timestamp from facebook_messages where sender_id = 'fbid:1529367683'").fetchall()
res_recv = conn.execute("select timestamp from facebook_messages where sender_id != 'fbid:1529367683'").fetchall()

#build a numpy array of integers from the sql strings, then convert to datetime
column_sent = np.array([int(x[0]) for x in res_sent]).astype('datetime64[s]')
column_recv = np.array([int(x[0]) for x in res_recv]).astype('datetime64[s]')

#dataframe for counting sent
df_sent = pd.DataFrame({'ts': column_sent})
df_sent['year'] = df_sent['ts'].dt.year
df_sent['month'] = df_sent['ts'].dt.month
df_sent_count = df_sent.groupby(by=['year', 'month']).count()#.plot(kind="bar")

#dataframe for counting received
df_recv = pd.DataFrame({'ts': column_recv})
df_recv['year'] = df_recv['ts'].dt.year
df_recv['month'] = df_recv['ts'].dt.month
df_recv_count = df_recv.groupby(by=['year', 'month']).count()

#overlay the two charts
merged = pd.concat([df_sent_count,df_recv_count],axis=1,keys=['year','month'])
merged.plot(kind="bar")
print merged
plt.show()
