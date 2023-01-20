# Filmnder

You can see it in [**THIS LINK**](https://filmnder.onrender.com).

Filmnder is a web which allows you and your partner to evaluate individually the top-ranked 1800ish films from IMDB in terms of interest in watching them. Then a "tinder-like" match appears when you two coincide in one of the films. It also includes 3 list options:

- list the films you and your partner have "match"
- list the films you are interested in and your partner not (so when you want to watch a film alone, you don't have to worry about overlaying)
- list the interest given by both of you on all films, and allow to change them afterwards

It is a web implementation using Bootstrap, HTML, CSS, plain javascript and NodeJS. The database is implemented in MongoDB. It consists on both server and client-side responsive programming web service.

## The Data

The dataset used is the [**IMDb movies extensive dataset**](https://www.kaggle.com/stefanoleone992/imdb-extensive-dataset?select=IMDb+movies.csv), which consists of 4 CSV files (as explained in the Kaggle page):

> The movies dataset includes 85,855 movies with attributes such as movie description, average rating, number of votes, genre, etc.

> The ratings dataset includes 85,855 rating details from a demographic perspective.

> The names dataset includes 297,705 cast members with personal attributes such as birth details, death details, height, spouses, children, etc.

> The title principals dataset includes 835,513 cast members roles in movies with attributes such as IMDb title id, IMDb name id, order of importance in the movie, role, and characters played.

Within this datasets, the names dataset is discarded, as it doesn't contribute at all. And from the other categories, I kept: imdb_title_id, original_title, year, genre, duration, language, director, actors, weighted_average_vote and total_votes; although the actors and the language haven't been used at all.

After that more filtering was done, as the films with less than 100.000 total votes and a weighted average vote below 5 were removed too. This resulted in the final 1.847 movies which were ranked by their weighted average vote and saved in a CSV file.

(All of it is done in the 1-updateTableFilms.py file)

#### The images

From the CSV file obtained previously, the URL of the first photo obtained in the Bing web search engine for each title is saved in another CSV file, in order to show later when the web is implemented.

(This is done in the 2-getImages.py file)

## Usage

To implement Filmnder you require the Languages/Libraries explained the next section, be sure to have them installed.

First of all, do a fork of this repository and download the forked version.

```
$ git clone https://www.github.com/<youruser>/filmnder.git
$ cd filmnder/
```

Create a MongoDB database and also create a .env file, which will include the next variable:
`CONNECTION_URL = mongodb+srv://<yourusername>:<yourpassword>@cluster0-5liml.mongodb.net/test?retryWrites=true&w=majority`. Replace the <>.

Download the Dataset from the [**URL**](https://www.kaggle.com/stefanoleone992/imdb-extensive-dataset?select=IMDb+movies.csv) inside the filmnder folder.

Then modify the file 3-... and change the Users variable with the usernames you want to use and run the files 1, 2 and 3 to obtain the desired CSV files IMDb_DB.csv and IMDb_urls.csv. This could take some time.

```
$ python3 1-updateTableFilms.py
$ python3 2-getImages.py
$ python3 3-start-relation.py
```

Now if you go to the MongoDB site you will see a new Database was created and 3 collections were added. You have to create one more with the name _users_. And inside you have to add two objects with two variables (three if we include the id): _name_ with the names used in the file 3; and _password_ with the password you want to use on the web.

After that, almost everything is done. If you want to only use it as local you can run it with:

```
$ node filmServer.js
```

And write localhost:3000 in your browser. Or in the case you prefer to deploy it, I did with Heroku, which works nice and is free.

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

  [python 3]: https://www.python.org
  [node.js]: https://nodejs.org
  [html]: https://www.w3schools.com/html/
  [css]: https://www.w3schools.com/css/
  [express]: http://expressjs.com
  [mongodb]: https://www.mongodb.com
  [path]: https://nodejs.org/api/path.html
  [serve-favicon]: https://www.npmjs.com/package/serve-favicon
  [dotenv]: https://www.npmjs.com/package/dotenv
  [underscore]: https://underscorejs.org/
  [bootstrap]: https://getbootstrap.com/

## Rights

Feel free to use it, although a little mention is always great.

Good Luck!
