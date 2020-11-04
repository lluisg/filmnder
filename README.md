# Filmnder
You can see it in [**THIS LINK**](https://filmnder.herokuapp.com/).

Filmnder is a web which allows you and your partner to evaluate individually the top ranked 1800ish films from IMDB in terms of interest in watching them. Then a "tinder-like" match appears when you two coincide in one of the films. It also include 3 list options:
- list the films you and your partner have "match"
- list the films you are interested in and your partner not (so when you want to watch a film alone, you don't have to worry abou overlaying)
- list the valorations of both of you, and allow to change them afterwards

It is a web implementation using Bootstrap, HTML, CSS, plain javascript and NodeJS. The database is implemented in MongoDB. It consists on a both server and client-side responsive programming web service.

## The Data
The dataset used is the [**IMDb movies extensive dataset**](https://www.kaggle.com/stefanoleone992/imdb-extensive-dataset?select=IMDb+movies.csv), which consists of 4 csv files (as explained in the kaggle page):
> The movies dataset includes 85,855 movies with attributes such as movie description, average rating, number of votes, genre, etc.

> The ratings dataset includes 85,855 rating details from demographic perspective.

> The names dataset includes 297,705 cast members with personal attributes such as birth details, death details, height, spouses, children, etc.

> The title principals dataset includes 835,513 cast members roles in movies with attributes such as IMDb title id, IMDb name id, order of importance in the movie, role, and characters played.

From them the names dataset is descarted, as it doesn't contribute at all. And from the other categories, I kept: imdb_title_id, original_title, year, genre, duration, language, director, actors, weighted_average_vote and total_votes; although the actors and the language hasn't been used at all.

After that more filtering was done, as the films with less than 100.000 total votes and a weighted average vote below 5 were removed too. This resulted in the final 1.847 movies which were ranked by their weighted average vote and saved in a csv file.

All of it is done in the 1-updateTableFilms.py file.

#### The images

From the csv file obtained previously, the url of the first photo obtained in the Bing web search engine for each title is saved in another csv file, in order to show later when the web is implemented.

This is done in the 2-getImages.py file.


## Usage
To implement Filmnder you require the Languages/Libraries explained the next section, be sure to have them installed.

First of all do a fork of this repository and download the forked version.
```
$ git clone https://www.github.com/<youruser>/filmnder.git
$ cd filmnder/
```
Create a MongoDB database and also create a .env file, which will include the next variable:
`CONNECTION_URL = mongodb+srv://<yourusername>:<yourpassword>@cluster0-5liml.mongodb.net/test?retryWrites=true&w=majority`. Replace the <>.

Download the Dataset from the [**URL**](https://www.kaggle.com/stefanoleone992/imdb-extensive-dataset?select=IMDb+movies.csv) inside the filmnder folder.

Then modify the file 3-... and change the Users variable with the usernames you want to use and run the files 1, 2 and 3 to obtain the desired csv files IMDb_DB.csv and IMDb_urls.csv. This could take some time.
```
$ python3 1-updateTableFilms.py
$ python3 2-getImages.py
$ python3 3-start-relation.py
```

Now if you go to the MongoDB site you will see a new Database was created and 3 collections were added. You have to create one more with the name *users*. And inside you have to add two objects with two variables (three if we include the id): *name* with the names used in the file 3; and *password* with the password you want to use on the web.

After that almost everything is done. If you want to only use it as local you can run it with:
```
$ node filmServer.js
```
And write localhost:3000 in your browser. Or in the case you prefer to deploy it, I did with heroku, which works nice and is free.

### Languages and more
- [PYTHON 3]
- [NODE.JS]
- [HTML]
- [BOOTSTRAP]
- [EXPRESS]
- [MONGODB]

Other packages/modules/libraries used:
- [PATH]
- [SERVE-FAVICON]
- [DOTENV]
- [UNDERSCORE]


   [PYTHON 3]: <https://www.python.org>
   [NODE.JS]: <https://nodejs.org>
   [HTML]: <https://www.w3schools.com/html/>
   [CSS]: <https://www.w3schools.com/css/>
   [EXPRESS]: <http://expressjs.com>
   [MONGODB]: <https://www.mongodb.com>
   [PATH]: <https://nodejs.org/api/path.html>
   [SERVE-FAVICON]: <https://www.npmjs.com/package/serve-favicon>
   [DOTENV]: <https://www.npmjs.com/package/dotenv>
   [UNDERSCORE]: <https://underscorejs.org/>
   [BOOTSTRAP]: <https://getbootstrap.com/>

## Rights
Feel free to use it, although a little mention is always great.

Good Luck!
