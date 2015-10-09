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


/////////////////////////////////////
/// Functionnal var
var tk_jalabert = [];
var tk_landreau = [];


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

router.route('/data/marker/ml/add')
      //add
      .post(function (req, res) {
         io.sockets.emit('add_marker',{user:'ml' ,lat:req.body.values.lat , long:req.body.values.long , hr:req.body.values.hr , speed:req.body.values.speed * 3.6,distance:req.body.values.distance});
         res.send(200, 'Marker call');
      });

router.route('/data/marker/lj/add')
      //add
      .post(function (req, res) {
         io.sockets.emit('add_marker',{user:'lj' , lat:req.body.values.lat , long:req.body.values.long , hr:req.body.values.hr , speed:req.body.values.speed * 3.6,distance:req.body.values.distance});
         res.send(200, 'Marker call');
  });

  router.route('/data/tk/ml/add')
        //add
        .post(function (req, res) {
          // store the tk
      //    tk_jalabert.push(tk);

          // emit the socket
          io.sockets.emit('add_pk',{user:'ml' ,tk:req.body.values.tk,nb_k:req.body.values.nb_k});
          res.send(200, 'Tk call');
        });

  router.route('/data/tk/lj/add')
        //add
        .post(function (req, res) {
          // store the tk
        //  tk_landreau.push(tk);

          io.sockets.emit('add_pk',{user:'lj' , tk:req.body.values.tk,nb_k:req.body.values.nb_k});
          res.send(200, 'Tk call');
    });

app.use('/api', router);
  ///////////////////////////////
  // END ROUTING
  //////////////////////////////////

// For hosing on Heroku
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 2);
  io.set('log level', 1)
});
