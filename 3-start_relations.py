import requests
import re
import sys
import os
import http.cookiejar
import json
import urllib.request, urllib.error, urllib.parse
import pandas as pd
import string
import unidecode
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import os
from pymongo import MongoClient

if __name__ == "__main__":

    Users=['lluis', 'maria']
    urls = {}

    with open('list_index.txt', 'r') as f:
        content_i = f.readlines()

    for ind, id in enumerate(content_i):
        urls[ind] = [int(id), 0, 0]

    df_urls = pd.DataFrame.from_dict(urls, orient='index', columns=['_id', Users[0], Users[1]])
    print(df_urls.shape)


# Update MongoDB -----------------------------------------------------------

    load_dotenv()
    CONNECTION_URL = os.getenv("CONNECTION_URL")
    myclient = MongoClient(CONNECTION_URL)
    print('entering DB')

    dblist = myclient.list_database_names()
    if "filmsDB" in dblist:
        print("The database exists.")
    else:
        print("A database will be created")
    mydb = myclient["filmsDB"]

    collist = mydb.list_collection_names()
    if "relations" in collist:
      print("The collection exists. It will be reseted")
      mycol = mydb["relations"]
      mycol.drop()
    else:
      print("The collection does not exists. One will be created.")

    mycol = mydb["relations"]
    mylist = df_urls.to_dict("records")
    x = mycol.insert_many(mylist)
