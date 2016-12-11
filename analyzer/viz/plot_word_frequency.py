from dotenv import load_dotenv, find_dotenv
import os
from sqlalchemy import create_engine, update
load_dotenv(find_dotenv())
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from collections import Counter
#Connect to MySQL
engine = create_engine(os.environ.get("mysql_python_adapter")
	+os.environ.get("mysql_user")
	+":"+os.environ.get("mysql_password")
	+"@"+os.environ.get("mysql_host")
	+"/"+os.environ.get("mysql_database")+"?charset=utf8mb4")

conn = engine.connect()

me = "fbid:1529367683"
stopwords = "just oh yeah ok u its up did what who is a at is he the i like to it and you it's in of that on so no do this if or are no you in my me have for not lol but my with was be we was".split()

sql_base="select body from facebook_messages where"
sql_addon=""
# sql_addon+="limit 2000"
res_sent = conn.execute(sql_base+" sender_id = '"+me+"'"+sql_addon).fetchall()
res_recv = conn.execute(sql_base+" sender_id != '"+me+"'"+sql_addon).fetchall()


#process sent
column_sent_body = np.array([x[0] for x in res_sent])
df = pd.DataFrame({'body': filter(None, column_sent_body)})
df=df.dropna(axis=1,how='all')
text_block = " ".join(df["body"])

querywords =text_block.split()

resultwords  = [word for word in querywords if word.lower() not in stopwords]
text_block = ' '.join(resultwords)

counter_sent = Counter(text_block.split())
counter_sent = counter_sent.most_common(70)
word_values_sent = [x[0] for x in counter_sent]
word_counts_sent = [x[1] for x in counter_sent]

#process recv
column_recv_body = np.array([x[0] for x in res_recv])
df = pd.DataFrame({'body': filter(None, column_recv_body)})
df=df.dropna(axis=1,how='all')
text_block = " ".join(df["body"])

querywords =text_block.split()

resultwords  = [word for word in querywords if word.lower() not in stopwords]
text_block = ' '.join(resultwords)

counter_recv = Counter(text_block.split())
counter_recv = counter_recv.most_common(70)
word_values_recv = [x[0] for x in counter_recv]
word_counts_recv = [x[1] for x in counter_recv]

# Plot histogram using matplotlib bar().
indexes_sent = np.arange(len(word_values_sent))
indexes_recv = np.arange(len(word_values_recv))
width = 0.9

fig, ax = plt.subplots(nrows=2,ncols=1)

print ax

ax[0].bar(indexes_sent, word_counts_sent, width)
ax[0].legend(["sent messages"])
ax[1].bar(indexes_recv, word_counts_recv, width, color='red')
ax[1].legend(["received messages"])


# ax[1].set_xticklabels(word_values)

plt.sca(ax[0])
plt.xticks(indexes_sent + width * 0.5, word_values_sent, rotation=45)
plt.sca(ax[1])
plt.xticks(indexes_recv + width * 0.5, word_values_recv, rotation=45)

plt.show()

