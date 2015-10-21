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
var datasML = new Array();
var datasLJ = new Array();

var startMarathonDate = null;

var sendData;
var sendDataKm;

var distanceML = 0;
var distanceLJ = 0;

var speedML = 12;
var speedLJ = 14;

var hrML = 110;
var hrLJ = 120;




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
  console.log("marker/ml/add=>Value");
  console.log(req.body);
  //store the distance , hr , speed
  if(req.body.values.distance != null){
    distanceML  = req.body.values.distance;
  }

  if(req.body.values.hr != null){
    hrML  = round(req.body.values.hr,0);
  }

  if(req.body.values.speed != null){
    speedML  = round(req.body.values.speed * 3.6,1);
  }

  //Emit io
  io.sockets.emit('add_marker',{user:'ml' ,lat:req.body.values.lat , long:req.body.values.long , hr:hrML ,speed:speedML ,distance:distanceML});
  res.send(200, 'OK');
});

router.route('/data/marker/lj/add')
//add
.post(function (req, res) {
  console.log("marker/lj/add=>Value");
  console.log(req.body);
  //store the distance , hr , speed
  if(req.body.values.distance != null){
    distanceLJ  = req.body.values.distance;
  }

  if(req.body.values.hr != null){
    hrLJ  = round(req.body.values.hr,0);
  }

  if(req.body.values.speed != null){
    speedLJ  = round(req.body.values.speed * 3.6,1);
  }

  //Emit io
  io.sockets.emit('add_marker',{user:'lj' ,lat:req.body.values.lat , long:req.body.values.long , hr:hrLJ ,speed:speedLJ ,distance:distanceLJ});
  res.send(200, 'OK');
});

router.route('/data/lj/add')
//add
.post(function (req, res) {
  console.log("km/lj/add=>Value");
  console.log(req.body);
  addDataTable('lj',req.body.values.distance,req.body.values.tklk, req.body.values.speedlk, req.body.values.hrlk);
  res.send(200, 'OK');
});

router.route('/data/ml/add')
//add
.post(function (req, res) {
  console.log("km/ml/add=>Value");
  console.log(req.body);
  addDataTable('ml',req.body.values.distance,req.body.values.tklk,req.body.values.speedlk, req.body.values.hrlk);
  res.send(200, 'OK');
});


router.route('/clock/start')
//add
.post(function (req, res) {
  startMarathonDate = new Date();
  initTimerMarathon();
  res.send(200, 'OK');
});

router.route('/clock/stop')
//add
.post(function (req, res) {
  io.sockets.emit('stop_clock');
  res.send(200, 'OK');
});


router.route('/message/add')
//add
.post(function (req, res) {
  io.sockets.emit('start_message',{message:req.body.message});
  res.send(200, 'OK');
});

router.route('/test/start')
//add
.post(function (req, res) {
  // init marahton date
  startMarathonDate = new Date();
  initTimerMarathon();

  var dist = 0;
  var distance = 0;
  startMarathonDate = new Date();

  sendData = setInterval(function() {
    dist = dist + 3002;
    sendDataTest(dist);
  }, 10000);


  sendDataKm = setInterval(function() {
    distance = distance + 1001;
    sendDataTestKm(distance);
  }, 20000);

  res.send(200, 'OK');
});


router.route('/test/stop')
.post(function (req, res) {
  clearInterval(sendDataKm);
  clearInterval(sendData);

  // init var
  datasML = new Array();
  datasLJ = new Array();

  // stop clok
  io.sockets.emit('stop_clock');

  res.send(200, 'OK');
});

app.use('/api', router);
///////////////////////////////
// END ROUTING
//////////////////////////////////


///////////////////////////////
// TEST
//////////////////////////////////
function sendDataTestKm(distance){

  var testHrLj = 130 + (Math.random() * 10);
  var testHrMl = 110 + (Math.random() * 10);

  var testSpeedLj = 5 + (Math.random() * 1);
  var testSpeedMl = 4 + (Math.random() * 1);

  addDataTable('lj',distance,"312",testSpeedLj,testHrLj);
  addDataTable('ml',distance,"412",testSpeedLj,testHrMl);
}


function sendDataTest(dist){

  var hrLj = 130 + (Math.random() * 10);
  var hrMl = 110 + (Math.random() * 10);

  var speedLj = 5 + (Math.random() * 1);
  var speedMl = 4 + (Math.random() * 1);

  var longMl = 4.953425025939941 + (Math.random() / 100);
  var latMl = 45.759 + (Math.random() / 100);

  var longLj = 4.953425025939941+ (Math.random() / 100);
  var latLj = 45.759 + (Math.random() / 100);

  distanceLJ = dist;
  distanceML = dist;

  speedML = speedMl;
  speedLJ = speedLj;

  hrLJ = hrLj;
  hrML = hrMl;

  io.sockets.emit('add_marker',{user:'lj' , lat:latLj , long:longLj , hr:round(hrLj,0), speed:round(speedLj,1)  ,distance:dist});
  io.sockets.emit('add_marker',{user:'ml' , lat:latMl , long:longMl , hr:round(hrMl,0) , speed:round(speedMl,1) ,distance:dist});
}

///////////////////////////////
// END TEST
//////////////////////////////////


///////////////////////////////
// Data managemet
//////////////////////////////////

function addDataTable(user,distance,tklk,speedlk,hrlk){
    // Calcul km
    nbk = Math.floor((distance+100)/1000);

    // Convert value to right format
    speedlk = round(speedlk * 3.6,1);
    hrlk = round(hrlk,0);
    tklk = secondsToTime(tklk);
    time = getTimeSinceBegining();

    var tableKm = [time,tklk,speedlk,hrlk];
    if(user === 'lj'){
      // Send data the first time
      if(datasLJ[nbk] == null){
        // emit the socket
        io.sockets.emit('add_data_table',{user:user,nbk:nbk,time:time,tklk:tklk,speedlk:speedlk,hrlk:hrlk});
      }
      datasLJ[nbk] = tableKm;
    }else{
      // Send data the first time
      if(datasML[nbk] == null){
        // emit the socket
        io.sockets.emit('add_data_table',{user:user,nbk:nbk,time:time,tklk:tklk,speedlk:speedlk,hrlk:hrlk});
      }
      datasML[nbk] = tableKm;
    }
}

function initTimerMarathon(){
  if(startMarathonDate != null){
    var timer = (new Date() - startMarathonDate) / 1000;
    io.sockets.emit('init_clock',timer);
  }
}

function getTimeSinceBegining(){
  return   secondsToTime((new Date() - startMarathonDate) / 1000) ;
}

function initTablekm(){
  io.sockets.emit('init_data_table_lj',datasLJ);
  io.sockets.emit('init_data_table_ml',datasML);
}

function initValue(){
  console.log('Distance');
  console.log(distanceLJ);
  console.log(distanceML);
  io.sockets.emit('init_value',{distanceLJ:distanceLJ,distanceML:distanceML});
}

///////////////////////////////
// Data managemet
//////////////////////////////////

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}


function secondsToTime(secs)
{
    secs = Math.round(secs);
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
}

///////////////////////////////
// END ROUTING
//////////////////////////////////

// Quand on client se connecte, on renseigne le graph
io.sockets.on('connection', function (socket) {
  // init table jm
  initTablekm();
  //calcul timer
  initTimerMarathon();
  //init value on conection
  initValue();

});

// For hosing on Heroku
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 2);
  io.set('log level', 1)
});
