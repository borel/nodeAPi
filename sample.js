var express = require('express');
var app = express();
// var mongoose = require('mongoose');
// var mongodb = require('mongodb');

// mongoose connect
// mongoose.connect('mongodb://localhost:27017/borel');
//
//
// var userSchema = new mongoose.Schema({
//   _id     : Number,
//   firstName: String,
//   lastName: String,
//   birthDate: Date,
//   sex: Number,
//   updated_at: { type: Date, default: Date.now },
// });
//
// var User = mongoose.model('User', userSchema);

// var user = new User({_id:0,firstName: 'Pauline', lastName: 'Borel', date: '20/02/1985'});
//
// user.save(function(err){
//     if(err)
//         console.log(err);
//     else
//         console.log(user);
// });

// app.get('/create', function (req, res) {
//   User.find(function (err, users) {
//     if (err) return console.error(err);
//       res.send(users);
//   });
// });
//
// app.get('/all', function (req, res) {
//   User.find(function (err, users) {
//     if (err) return console.error(err);
//       res.send(users);
//   });
// });
//
// var server = app.listen(3000, function () {
//   var host = server.address().address;
//   var port = server.address().port;
//
//   console.log('Example app listening at http://%s:%s', host, port);
// });

var port = process.env.PORT || 8080;        // set our port
// ROUTES FOR OUR API
// =============================================================================
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

// more routes for our API will happen here
// router.route('/users')
//   // gel all user
//   .get(function (req, res) {
//     User.find(function (err, users) {
//       if (err) return console.error(err);
//         res.json(users);
//     });
//   });

router.route('/user/borel')
  // gel all user
  .get(function (req, res) {
    var user = {'fistName':'Pauline', 'lastName':'Borel'};
      res.json(user);
  });

  // REGISTER OUR ROUTES -------------------------------
  // all of our routes will be prefixed with /api
  app.use('/api', router);

  // START THE SERVER
  // =============================================================================
  app.listen(port);
  console.log('Magic happens on port ' + port);
