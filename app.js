var express = require('express');
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)

    io.configure(function () {
      io.set("transports", ["xhr-polling"]);
      io.set("polling duration", 10);
    });


// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

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

router.route('/robot/1')
  // gel all user
  .get(function (req, res) {
        io.sockets.emit('message',{pseudo: 'robot', message: 'A m i a Robot or a human ?'});
        res.send(200, 'Robot call');
  });

  router.route('/human/1')
    // gel all user
    .get(function (req, res) {
        io.sockets.emit('message',{pseudo: 'human', message: 'human after all'});
        res.send(200, 'Human call');
    });

  app.use('/api', router);
  // END ROUTING
  //////////////////////////////////

// io.sockets.on('connection', function (socket, pseudo) {
//     // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
//     socket.on('nouveau_client', function(pseudo) {
//         socket.pseudo = pseudo;
//         socket.broadcast.emit('nouveau_client', pseudo);
//     });
//
//     // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
//     socket.on('message', function (message) {
//         socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
//     });
// });

server.listen(5000);
