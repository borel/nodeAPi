var express = require('express');
var app = require('express')(),
server = require('http').createServer(app),
io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
// Authorisation key - to share with mobile app
var authorizationKey = '93462404';
//Laucnh server on 8082
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

var startMarathonDateML = null;
var startMarathonDateLJ = null;

var endMarathonDateML = null;
var endMarathonDateLJ = null;

var sendData;
var sendDataKm;

var distanceML = 0;
var distanceLJ = 0;

var speedML = null;
var speedLJ = null;

var hrML = null;
var hrLJ = null;

var timestampML = null;
var timestampLJ = null;




////////////////////////////////////////
// API routing
var router = express.Router();              // get an instance of the express Router

// Prefix API
app.use('/api', router);

// middleware to use for all requests -
router.use(function(req, res, next) {
  //  check authorization
  if(req.headers.authorization != authorizationKey){
      console.log('Unauthorized')
      res.send(401, 'Unauthorized');
    }else{
        // do logging
        next(); // make sure we go to the next routes and don't stop here
    }
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
    speedML = filterValue(speedML, round(req.body.values.speed * 3.6,1))
  }

  // If the clock is not start , then we statck the clock
  if(startMarathonDateML == null && req.body.values.time != null){
    //fiwe timestamp and convert to date
    dateTimestamp = (new Date().getTime() - req.body.values.time);
    startMarathonDateML = new Date(dateTimestamp);

    // save the timestamp
    timestampML = req.body.values.time;

    // calcul the timer and send to IHM
    var timer = (new Date() - startMarathonDateML) / 1000;
    io.sockets.emit('init_clock_ml',{timer:timer,finish:false});

  }else if(timestampML != null && req.body.values.time != null && timestampML > req.body.values.time){

    //fiwe timestamp and convert to date
    dateTimestamp = (new Date().getTime() - req.body.values.time);
    startMarathonDateML = new Date(dateTimestamp);

    // save the timestamp
    timestampML = req.body.values.time;

    // calcul the timer and send to IHM
    var timer = (new Date() - startMarathonDateML) / 1000;
    io.sockets.emit('init_clock_ml',{timer:timer,finish:false});

    // init the data km
    datasML = new Array();
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
  console.log(timer);
  console.log(timestampLJ);
  
  //store the distance , hr , speed
  if(req.body.values.distance != null){
    distanceLJ  = req.body.values.distance;
  }else{
    distanceLJ = 0;
  }

  hrLJ  = round(req.body.values.hr,0);

  if(req.body.values.speed != null){
    speedLJ = filterValue(speedLJ, round(req.body.values.speed * 3.6,1))
  }else{
    speedLJ = 0;
  }

  // first load
  if(startMarathonDateLJ == null && req.body.values.time != null ){

    //fiwe timestamp and convert to date
    dateTimestamp = (new Date().getTime() - req.body.values.time);
    startMarathonDateLJ = new Date(dateTimestamp);

    // save the timestamp
    timestampLJ = req.body.values.time;

    // calcul the timer and send to IHM
    var timer = (new Date() - startMarathonDateLJ) / 1000;
    io.sockets.emit('init_clock_lj',{timer:timer,finish:false});

  }else if(timestampLJ != null && req.body.values.time != null && timestampLJ > req.body.values.time){
    //fiwe timestamp and convert to date
    dateTimestamp = (new Date().getTime() - req.body.values.time);
    startMarathonDateLJ = new Date(dateTimestamp);

    // save the timestamp
    timestampLJ = req.body.values.time;

    // calcul the timer and send to IHM
    var timer = (new Date() - startMarathonDateLJ) / 1000;
    io.sockets.emit('init_clock_lj',{timer:timer,finish:false});

    // init the data km
    datasLJ = new Array();
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


router.route('/clock/ml/start')
.post(function (req, res) {
  // Init date
  startMarathonDateML = new Date();

  io.sockets.emit('start_clock_ml');
  res.send(200, 'OK');
});

router.route('/clock/lj/start')
.post(function (req, res) {
  // Init date
  startMarathonDateLJ = new Date();

  io.sockets.emit('start_clock_lj');
  res.send(200, 'OK');
});

router.route('/clock/ml/stop')
//add
.post(function (req, res) {
  endMarathonDateML = new Date();
  io.sockets.emit('stop_clock_ml');
  res.send(200, 'OK');
});

router.route('/clock/lj/stop')
//add
.post(function (req, res) {
  endMarathonDateLJ = new Date();
  io.sockets.emit('stop_clock_lj');
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
  startMarathonDateML = new Date();
  startMarathonDateLJ = new Date();

  initTimerMarathon();

  var dist = 0;
  var distance = 0;


  sendData = setInterval(function() {
    dist = dist + 502;
    sendDataTest(dist);
  }, 10000);


  sendDataKm = setInterval(function() {
    distance = distance + 1100;
    sendDataTestKm(distance);
  }, 15000);

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



///////////////////////////////
// END ROUTING
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
  time = getTimeSinceBegining(user);

  if(user === 'lj'){
    // Send data the first time
    if(datasLJ[nbk] == null){
      // emit the socket
      io.sockets.emit('add_data_table',{user:user,nbk:nbk,time:time,tklk:tklk,speedlk:speedlk,hrlk:hrlk});
    }else{
      // we take the first time for each km
      time =  datasLJ[nbk][0];
    }
    var tableKm = [time,tklk,speedlk,hrlk];
    datasLJ[nbk] = tableKm;
  }else{
    // Send data the first time
    if(datasML[nbk] == null){
      // emit the socket
      io.sockets.emit('add_data_table',{user:user,nbk:nbk,time:time,tklk:tklk,speedlk:speedlk,hrlk:hrlk});
    }else{
      // we take the first time for each km
      time =  datasML[nbk][0];
    }
    var tableKm = [time,tklk,speedlk,hrlk];
    datasML[nbk] = tableKm;
  }
}

function initTimerMarathon(){

// if the course is finish , we take the finisth time else we take the currtent time
  if(startMarathonDateML != null){
    if(endMarathonDateML != null){
      var timer = (endMarathonDateML - startMarathonDateML) / 1000;
      io.sockets.emit('init_clock_ml',{timer:timer,finish:true});
    }else{
      var timer = (new Date() - startMarathonDateML) / 1000;
      io.sockets.emit('init_clock_ml',{timer:timer,finish:false});
    }
  }

  if(startMarathonDateLJ != null){
    if(endMarathonDateLJ != null){
      var timer = (endMarathonDateLJ - startMarathonDateLJ) / 1000;
      io.sockets.emit('init_clock_lj',{timer:timer,finish:true});
    }else{
      var timer = (new Date() - startMarathonDateLJ) / 1000;
      io.sockets.emit('init_clock_lj',{timer:timer,finish:false});
    }
  }
}

function getTimeSinceBegining(user){
  var date = null;
  if(user === 'lj'){
    date = startMarathonDateLJ
  }else {
    date = startMarathonDateML
  }

  return   secondsToTime((new Date() - date) / 1000) ;
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
// End Data Management
//////////////////////////////////

///////////////////////////////
// Utils
//////////////////////////////////
function filterValue(oldValue,newValue){
  if(oldValue != 0 && oldValue != null){
    var value = 0.85 * oldValue + (1-0.85) * newValue;
    return round(value,1);
  }
  return newValue;
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}


function secondsToTime(secs)
{
  secs = Math.round(secs);
  var hours = Math.floor(secs / (60 * 60));
  if(hours < 10){
    hours = "0"+hours;
  }

  var divisor_for_minutes = secs % (60 * 60);
  var minutes = Math.floor(divisor_for_minutes / 60);
  if(minutes < 10){
    minutes = "0"+minutes;
  }

  var divisor_for_seconds = divisor_for_minutes % 60;
  var seconds = Math.ceil(divisor_for_seconds);
  if(seconds < 10){
    seconds = "0"+seconds;
  }

  var obj = {
    "h": hours,
    "m": minutes,
    "s": seconds
  };
  return obj;
}

///////////////////////////////
// END Utils
//////////////////////////////////


///////////////////////////////
// IO Configure
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

///////////////////////////////
// /IO Configure
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
