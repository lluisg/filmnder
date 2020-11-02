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

app.get("/getInfo", (request, response) => {
  db.collection('films').find().sort({ _id:1 }).toArray((error, result) => {
    if(error) {
      console.log('Error Getting INFO DB (Film Server)')
      return response.status(500).send(error);
    }
    console.log('Returned Info DB without problem');
    response.json({result});
  });
});

app.get("/getUrls", (request, response) => {
  db.collection('url_images').find().sort({ _id:1 }).toArray((error, result) => {
    if(error) {
      console.log('Error Getting URLS DB (Film Server)')
      return response.status(500).send(error);
    }
    console.log('Returned Urls DB without problem');
    response.json({result});
  });
});

app.get("/getRelations", (request, response) => {
  db.collection('relations').find().sort({ _id:1 }).toArray((error, result) => {
    if(error) {
      console.log('Error Getting Relations DB (Film Server)')
      return response.status(500).send(error);
    }
    console.log('Returned Relations DB without problem');
    response.json({result});
  });
});

app.post('/updateRelation', async (request, response) => {
  /*
  pass the [username, film_id, valoration]
  returns if the user is in the database or not
  */
  console.log('I got a request!');
  console.log(request.body.data);
  user = request.body.data.username
  id = request.body.data.id
  val = request.body.data.valoration
  console.log(user, id, val)

  db.collection("relations").updateOne({_id:id}, {$set: { [user]: val }},  function(error, result) {
    if(error) {
        console.log('erroor updating relations')
        return response.status(500).send(error);
    }else{
      console.log("Successfully updated the relations");
    }
    response.json({
      status:'updated'
    });
  });
});
