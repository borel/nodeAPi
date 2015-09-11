var express = require('express');
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
var bodyParser = require('body-parser');

server.listen(process.env.PORT || 8082);


//Chargement de la page index.html
app.use(require('express').static(__dirname + '/client'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

////////////////////////////////////////
// API routing
var router = express.Router();              // get an instance of the express Router


// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

  router.route('/geo/add')
      //add
      .post(function (req, res) {
         io.sockets.emit('message',{name: req.body.values.name, lat:  req.body.values.lat , long:  req.body.values.long});

          // io.sockets.emit('message',{name: 'borel', lat: '45.720580' , long: '3.187303'});

          res.send(200, 'Marker call');
      });


  router.route('/geo/addSea')
      // gel all user
      .get(function (req, res) {
          console.log(req);
          io.sockets.emit('message',{name: 'human', lat: '4.32' , long: '172'});
          res.send(200, 'Marker call');
      });

  app.use('/api', router);
  ///////////////////////////////
  // END ROUTING
  //////////////////////////////////

io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo) {
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    });
});

// For hosing on Heroku
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
  io.set('log level', 1)
});
