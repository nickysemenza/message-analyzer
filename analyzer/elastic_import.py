#Script to bridge MySQL -> ElasticSearch
from dotenv import load_dotenv, find_dotenv
import os
from elasticsearch import Elasticsearch
from sqlalchemy import create_engine
import pymysql.cursors
load_dotenv(find_dotenv())
import logging

#Connect to MySQL
engine = create_engine("mysql+pymysql://"
	+os.environ.get("mysql_user")
	+":"+os.environ.get("mysql_password")
	+"@"+os.environ.get("mysql_host")
	+"/"+os.environ.get("mysql_database")+"?charset=utf8mb4")

conn = engine.connect()

#Connect to ES
es = Elasticsearch()

index_name = "facebook1"
if es.indices.exists(index_name):
    es.indices.delete(index=index_name)
settings = {
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0
    },
    "mappings": {
        "facebook-message": {
            "properties": {
                "timestamp": {
                    "type": "date"
                }
            },
            "dynamic_templates": [
                {
                    "subattachment_object_template": {
                        "path_match": "attachments.subattachments.*",
                        "mapping": {
                            "type": "object",
                            "enabled": "false"

                        }
                    }
                }
            ]
        }
     }
}
es.indices.create(index=index_name, ignore=400, body=settings)
for x in conn.execute("SELECT raw, message_id from facebook_messages").fetchall():
	raw = x[0].encode("utf-8")
	mid = x[1].encode("utf-8")
	# print raw
	# print mid
	try:
		es.index(index=index_name, doc_type="facebook-message", id=mid, body=raw)
	except Exception:
		# print Exception
		logging.exception("Something awful happened!")
		print raw