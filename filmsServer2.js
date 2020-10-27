const Express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

var app = Express();

app.use(Express.static(__dirname + '/public'));
app.use(Express.json());

require('dotenv').config()
var favicon = require('serve-favicon');
var path = require('path');
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
var _ = require('underscore');

const CONNECTION_URL = process.env.CONNECTION_URL;
const DATABASE_NAME = "englishDB";

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

var socket = require('socket.io');
var io = socket(server)

var users_connected = {}; //users connected
var units = {}; //units of the users
var pair_users = {}; //connections between users
io.sockets.on('connect', function(socket) {
    users_connected[socket.id] = 0;
    console.log('new socket')
    console.log(users_connected)

    socket.on('unit_user', function(unit){
      units[socket.id] = unit;
      console.log('put unit');
      console.log(users_connected);
      console.log(units);

      for(var key in users_connected){
        // if I find someone who is not connected already and has the same unit as me
        // I put both values as connected and warn both of us that we have been connected
        if(users_connected[key] == 0 && units[key] == units[socket.id] && key != socket.id){
          users_connected[socket.id] = 1;
          users_connected[key] = 1;
          // pair_users[socket.id] = key;
          console.log('user '+socket.id+' paired with '+key);
          console.log(users_connected);
          io.to(socket.id).emit('paired', key, 1);
          socket.broadcast.to(key).emit('paired', socket.id, 2);
          // socket.broadcast.to(key).emit('paired', socket.id);
          break;
        }
        console.log('NO CONNECTION FOUND');
      }
    });

    socket.on('conn_partner', function(partner_id){
      pair_users[socket.id] = partner_id;
      console.log('pairing done for ', socket.id)
      console.log(pair_users)
    });
    socket.on('name_rival', function(data){
      socket.broadcast.to(pair_users[socket.id]).emit('named_rival', data);
    });


    socket.on('disconnect', function() {
      // delete the socket to disconnect and its unit, and its connection
      users_connected = _.omit(users_connected, socket.id);
      units = _.omit(units, socket.id);

      socket.broadcast.to(pair_users[socket.id]).emit('pair_disconnect');
      pair = pair_users[socket.id]
      if(pair != undefined){ //if there were a connection with anybody
        pair_users = _.omit(pair_users, pair)
        pair_users = _.omit(pair_users, socket.id)

        users_connected[pair] = 0;
      }

      console.log('user disconnected')
      console.log(users_connected)
      console.log(pair_users)
    });

    socket.on('paint', function(data){
      socket.broadcast.to(pair_users[socket.id]).emit('painted', data);
    });

    socket.on('write', function(data){
      socket.broadcast.to(pair_users[socket.id]).emit('written', data);
    });

    socket.on('set_actual_guess', function(data){
      socket.broadcast.to(pair_users[socket.id]).emit('get_actual_guess', data);
    });

    socket.on('cleanBlackboard', function(){
      socket.broadcast.to(pair_users[socket.id]).emit('cleanedBlackboard');
    });
    socket.on('set_words_completed', function(){
      socket.broadcast.to(pair_users[socket.id]).emit('get_words_completed');
    });
    socket.on('pass_next_word', function(){
      socket.broadcast.to(pair_users[socket.id]).emit('passed_next_word', false);
    });


});


app.get("/getDB/:unit", (request, response) => {
  /*
  pass the unit and exercice
  returns the complete database (if necessary sorted or others)
  */
  console.log('request parameters',request.params);
  const ex = request.params.unit.split('&')[0];
  const unit = parseInt(request.params.unit.split('&')[1]);

  if(ex=='crossword'){
      db.collection(ex).find({ unit:unit }).project({ unit:0, _id:0})
                                .sort({ crossword_position:1 }).toArray((error, result) => {
        if(error) {
          console.log('errroooooorr croswword DBBB')
          return response.status(500).send(error);
        }
        console.log('The query result is: ', result);
        response.json({result});
      });

  }else if(unit == 0){
    db.collection(ex).find().project({ unit:0, _id:0})
                              .toArray((error, result) => {
      if(error) {
        console.log('errroooooorr DBBB')
        return response.status(500).send(error);
      }
      result_shuffled = shuffleList(result)
      console.log('The query shuffled result is: ', result_shuffled);
      response.json({result});
    });

  }else if(ex=='multiple_choice'){
    db.collection(ex).find({ unit:unit }).project({ unit:0, _id:0})
                              .toArray((error, result) => {
      if(error) {
        console.log('errroooooorr DBBB')
        return response.status(500).send(error);
      }
      result_shuffled = shuffleList(result)
      console.log('The query shuffled result is: ', result_shuffled);
      response.json({result});
    });

  }else{
      db.collection(ex).find({ unit:unit }).project({ unit:0, _id:0})
                                .toArray((error, result) => {
        if(error) {
          console.log('errroooooorr DBBB')
          return response.status(500).send(error);
        }
        console.log('The query result is: ', result);
        response.json({result});
      });
  }
});

app.post('/checkUsr', async (request, response) => {
  /*
  pass the [username, password]
  returns if the user is in the database or not
  */
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

function shuffleList(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
