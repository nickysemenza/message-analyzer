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

res_sent = conn.execute("select timestamp from facebook_messages where sender_id = 'fbid:1529367683'").fetchall()
res_recv = conn.execute("select timestamp from facebook_messages where sender_id != 'fbid:1529367683'").fetchall()

# res_sent = ["1475426760","1375428699","1476385509"]
# res_recv = ["1475426760","1375428699"]


raw_ts_sent = [int(x[0]) for x in res_sent]
raw_ts_recv = [int(x[0]) for x in res_recv]

# raw_ts_sent.append(None)
num_sent = len(raw_ts_sent)
num_recv = len(raw_ts_recv)
# print num_recv, num_sent
if(num_recv > num_sent):
    for i in range(0,num_recv-num_sent):
        raw_ts_sent.append(None)
if(num_recv < num_sent):
    for i in range(0,num_sent-num_recv):
        raw_ts_recv.append(None)


import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# res = ["1475426760","1375428699"]
# x = np.array(res, dtype='|S4')
# timestamps = x.astype(np.float)
column_sent = np.array(raw_ts_sent).astype('datetime64[s]')
column_recv = np.array(raw_ts_recv).astype('datetime64[s]')
# column = ["1475426760","1375428699"]
df = pd.DataFrame({'sent': column_sent})

print df
df['year'] = df['sent'].dt.year
df['month'] = df['sent'].dt.month
# df['month2'] = df['received'].dt.month
# df['year2'] = df['received'].dt.year
df.groupby(by=['year', 'month']).count().plot(kind="bar")
# print df.groupby(['Week/Year', 'Category']).size()
# df.groupby(df.date.dt.month).count().plot(kind="bar")

plt.show()
# df = pd.DataFrame(column),
# df['datetime'] = pd.to_datetime(column, unit='ms')
# column = pd.to_datetime(column, errors="coerce")
# column.plot(kind='hist')

# print df
# df.groupby(df.date.dt.month).count().plot(kind="bar")
# import matplotlib.pyplot as plt
# import matplotlib.dates as md
# import numpy as np
# import datetime as dt
# import time

# n=len(res)
# duration=1000
# now=time.mktime(time.localtime())


# x = np.array(res, dtype='|S4')
# timestamps = x.astype(np.float)


# # timestamps=["1475426760","1475428699"]
# dates=[dt.datetime.fromtimestamp(ts) for ts in timestamps]
# datenums=md.date2num(dates)
# values=np.sin((timestamps-now)/duration*2*np.pi)
# plt.subplots_adjust(bottom=0.2)
# plt.xticks( rotation=25 )
# ax=plt.gca()
# xfmt = md.DateFormatter('%Y-%m-%d %H:%M:%S')
# ax.xaxis.set_major_formatter(xfmt)
# plt.plot(datenums,values)
# plt.show()