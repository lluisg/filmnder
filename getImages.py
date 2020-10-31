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


def get_soup(url,header):
    return BeautifulSoup(urllib.request.urlopen(
        urllib.request.Request(url,headers=header)),
        'html.parser')

def bing_image_search(query):
    query= query.split()
    query='+'.join(query)
    url="http://www.bing.com/images/search?q=" + query + "&FORM=HDRSC2"

    #add the directory for your image here
    DIR="Pictures"
    header={'User-Agent':"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36"}
    soup = get_soup(url,header)
    # print(soup)
    image_result_raw = soup.find("a",{"class":"iusc"})

    NoneType = type(None)
    if isinstance(image_result_raw, NoneType):
        # print('inside None: ', soup)
        return None

    m = json.loads(image_result_raw["m"])
    murl, turl = m["murl"],m["turl"]# mobile image, desktop image

    # image_name = urllib.parse.urlsplit(murl).path.split("/")[-1]
    # return (image_name,murl, turl)
    return turl


if __name__ == "__main__":

    NUM_IMAGES = 1 #number of images we want tot download

    #get film names
    df_films = pd.read_csv('IMDb_DB.csv')

    with open('list_films.txt') as f:
        content = f.readlines()
    list_films = [line.rstrip('\n') for line in content]

    with open('list_urls.txt', 'a') as u, open('list_films.txt', 'a') as f, open('list_index.txt', 'a') as i:
        for index, row in df_films.iterrows():

            film_name = row['original_title']

            film_name = unidecode.unidecode(film_name)
            exclude = set(string.punctuation)
            film_name = ''.join(ch for ch in film_name if ch not in exclude)

            if film_name not in list_films:
                turl = bing_image_search(film_name+' film')
                if turl != None:
                    u.write(turl+'\n')
                    f.write(film_name+'\n')
                    i.write(str(index)+'\n')
                else:
                    print('Not found:', film_name, index, turl)

    print('Done writing names and urls')

# Save Dataframe to CSV ---------------------------------------------------
    urls = {}

    with open('list_urls.txt', 'r') as f:
        content = f.readlines()
    with open('list_index.txt', 'r') as f:
        content_i = f.readlines()

    for ind, u in enumerate(content):
        # print(ind)
        # print(content_i[ind])
        # print(u)
        # print('\n')
        aux=u.replace('\n', '')
        urls[ind] = [int(content_i[ind]), aux]

    df_urls = pd.DataFrame.from_dict(urls, orient='index', columns=['_id', 'url'])
    print(df_urls.shape)

    df_urls.to_csv('./IMDb_urls.csv', index=False)
    print('Table saved')

# Update MongoDB -----------------------------------------------------------

    load_dotenv()
    CONNECTION_URL = os.getenv("CONNECTION_URL")
    myclient = MongoClient(CONNECTION_URL)
    print('entering DB')

    dblist = myclient.list_database_names()
    if "filmsDB" in dblist:
        print("The database exists.")
        mydb = myclient["filmsDB"]

        collist = mydb.list_collection_names()
        if "url_images" in collist:
          print("The collection exists. It will be reseted")
          mycol = mydb["url_images"]
          mycol.drop()
        else:
          print("The collection does not exists. One will be created.")

        mycol = mydb["url_images"]
        mylist = df_urls.to_dict("records")
        x = mycol.insert_many(mylist)

    print('Done')
