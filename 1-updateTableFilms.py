import pandas as pd
MIN_VOTES = 100000
MIN_RATING = 5

pd.set_option('display.max_columns', None)
# pd.reset_option('max_columns')
df_movies = pd.read_csv('IMDb_movies.csv')
df_ratings = pd.read_csv('IMDb_ratings.csv')
df_title = pd.read_csv('IMDb_title_principals.csv')

films_all = df_title.join(df_movies.set_index('imdb_title_id'), on='imdb_title_id').join(df_ratings.set_index('imdb_title_id'), on='imdb_title_id')

# SELECT ONLY THE INTERESTING COLUMNS
films = films_all[['imdb_title_id', 'original_title', 'year', 'genre', 'duration', 'language', 'director', 'actors', 'weighted_average_vote', 'total_votes']]
films = films.drop_duplicates()
print(list(films))
print('size: ', films['imdb_title_id'].size)

# SORT BY MAX RATING
films.sort_values(by=['weighted_average_vote'], inplace=True, ascending=False)

# REMOVE FILMS THAT DON'T FIT THE CRITERIA
films = films[films['total_votes'] > MIN_VOTES]
films = films[films['weighted_average_vote'] > MIN_RATING]
print('size after criteria: ', films['imdb_title_id'].size)
# print(films[:10])
# print(films.loc[films['original_title'] == 'Almost Famous'])

# ADD COUNTING INDEX ID
films.insert(0, '_id', range(len(films)))
# films['_id'] = range(len(films))
# data_dict = films.set_index('_id').to_dict("records")
mylist = films.to_dict("records")
# print(mylist)

#GETTING THE ENV VARIABLES --------------------------------------------------
from dotenv import load_dotenv
load_dotenv()
import os
CONNECTION_URL = os.getenv("CONNECTION_URL")

#UPDATING THE MONGO DB -------------------------------------------------------
from pymongo import MongoClient

myclient = MongoClient(CONNECTION_URL)
print('entering DB')

dblist = myclient.list_database_names()
if "filmsDB" in dblist:
    print("The database exists.")
else:
    print("A database will be created")

mydb = myclient["filmsDB"]

collist = mydb.list_collection_names()
if "films" in collist:
  print("The collection exists. It will be reseted")
  mycol = mydb["films"]
  mycol.drop()
else:
  print("The collection does not exists. One will be created.")

mycol = mydb["films"]
x = mycol.insert_many(mylist)

# WRITING EXCEL WITH NEW TABLE ------------------------------------------------

films.to_csv('./IMDb_DB.csv', index=False)
print('Table saved')
print('Done')
