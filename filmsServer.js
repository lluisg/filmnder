const Express = require("express");
var app = Express();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

app.use(Express.static(__dirname + '/public'));
app.use(Express.json());

require('dotenv').config()
var favicon = require('serve-favicon');
var path = require('path');
app.use(favicon(path.join(__dirname,'public','images','logo.ico')));
var _ = require('underscore');

const CONNECTION_URL = process.env.CONNECTION_URL;
const DATABASE_NAME = "filmsDB";

// CONNECT MONGODB DATABASE
const port = process.env.PORT || 3000;
var server = app.listen(port, () => {
    console.log('listening at '+port)
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(DATABASE_NAME);
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});


app.post('/checkUsr', async (request, response) => {
  console.log('I got a request!');
  console.log(request.body.user);
  user = request.body.user.username
  pass = request.body.user.password

  db.collection("users").findOne({ name:user, password:pass }, (error, result) => {
          if(error) {
              console.log('errooooooor users')
              return response.status(500).send(error);
          }

          if (result) {
            console.log('Found a username');
            console.log(result)
            response.json({
              status:'succes'
            });
          } else {
            console.log('No usernames found');
            response.json({
              status:'wrong'
            });
          }
      });
});
