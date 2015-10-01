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
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/data/ml/add')
      //add
      .post(function (req, res) {
         io.sockets.emit('message',{user:'ml' ,lat:req.body.values.lat , long:req.body.values.long , hr:req.body.values.hr , speed:req.body.values.speed ,distance:req.body.values.distance});
         res.send(200, 'Marker call');
      });

router.route('/data/lj/add')
      //add
      .post(function (req, res) {
         io.sockets.emit('message',{user:'lj' , lat:req.body.values.lat , long:req.body.values.long , hr:req.body.values.hr , speed:req.body.values.speed ,distance:req.body.values.distance});
         res.send(200, 'Marker call');
  });

app.use('/api', router);
  ///////////////////////////////
  // END ROUTING
  //////////////////////////////////

// For hosing on Heroku
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
  io.set('log level', 1)
});
