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

// array to store data
var tks = new Array();
var startMarathonDate = null;

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
          addPK('ml',req.body.values.tk,req.body.values.distance);

          // emit the socket
          io.sockets.emit('add_pk',{user:'ml' ,tk:req.body.values.tk});
          res.send(200, 'Tk call');
        });

  router.route('/data/tk/lj/add')
        //add
        .post(function (req, res) {

          // store the tk
          addPK('lj',req.body.values.tk,req.body.values.distance);

          // emit the socket
          io.sockets.emit('add_pk',{user:'lj' , tk:req.body.values.tk});
          res.send(200, 'Tk call');
    });

    router.route('/clock/start')
        //add
        .post(function (req, res) {
            startMarathonDate = new Date();
            initTimerMarathon();
            res.send(200, 'chrono_start');
     });

     router.route('/clock/stop')
         //add
         .post(function (req, res) {
            io.sockets.emit('stop_clock');
            res.send(200, 'chrono_stop');
      });

  router.route('/test')
      //add
      .post(function (req, res) {
          // init marahton date
          startMarathonDate = new Date();
          initTimerMarathon();

          var dist = 0;
          startMarathonDate = new Date();

          setInterval(function() {
            sendDataTest(req,dist);
            dist = dist + 2;
          }, 5000);

          res.send(200, 'API TEST CALLING');
   });


app.use('/api', router);
  ///////////////////////////////
  // END ROUTING
  //////////////////////////////////


  ///////////////////////////////
  // TEST
  //////////////////////////////////
  function sendDataTest(req,dist){
    console.log("je passe");
     var hrLj = 130 + (Math.random() * 10);
     var hrMl = 110 + (Math.random() * 10);

     var speedLj = 5 + (Math.random() * 1);
     var speedMl = 4 + (Math.random() * 1);

     var longMl = 4.953425025939941 + (Math.random() / 100);
     var latMl = 45.759 + (Math.random() / 100);

     var longLj = 4.953425025939941+ (Math.random() / 100);
     var latLj = 45.759 + (Math.random() / 100);


     io.sockets.emit('add_marker',{user:'lj' , lat:latLj , long:longLj , hr:hrLj, speed:speedLj  ,distance:dist});
     io.sockets.emit('add_marker',{user:'ml' , lat:latMl , long:longMl , hr:hrMl , speed:speedMl ,distance:dist});
  }

  ///////////////////////////////
  // END TEST
  //////////////////////////////////
  function initTimerMarathon(){
     if(startMarathonDate != null){
        var timer = (new Date() - startMarathonDate) / 1000;
        io.sockets.emit('init_clock',timer);
      }
  }

  ///////////////////////////////
  // Data managemet
  //////////////////////////////////



  ///////////////////////////////
  // END ROUTING
  //////////////////////////////////

  // Quand on client se connecte, on renseigne le graph
  io.sockets.on('connection', function (socket) {
      io.sockets.emit('init_pk',{tks:tks});
      //calcul timer
      initTimerMarathon();
  });

  // For hosing on Heroku
  io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 2);
    io.set('log level', 1)
  });
