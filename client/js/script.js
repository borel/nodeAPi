(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-57925881-11', 'auto');
ga('send', 'pageview');


////////////////////////////////////////////////////////////////////
////////////// GMAPS ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
var map = null;
var countLJ = null;
var countML = null;
var clock_ml = null
var clock_lj = null

// tab of user information
var users = {};

function mapInitialize() {
  map = new google.maps.Map(document.getElementById("map-canvas"), {
    zoom: 12,
  // nyc     center: new google.maps.LatLng(40.742494, -73.953867)
    center: new google.maps.LatLng(45.764043, 4.835659)
  });
  infowindow = new google.maps.InfoWindow({ content: 'Test' });
  google.maps.event.addListener(map, 'click', function() {
    infowindow.close(map);
  });

  nycMarathonInitialize();
}


function nycMarathonInitialize(){
  var nycMarathon = new google.maps.Polyline({
    path: nycMarathonCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  nycMarathon.setMap(map);
}


function updateMarker(name,lat,long){
  // Take the user
  var user = users[name];
  // si il n'esite pas on crÃ©ait le marker et son user
  if(!user){
    user = createUser(name);
    users[name] = user;
  }
  //On update le marker ( qu(il soit nouveau ou ancien))
  user.marker.setPosition(new google.maps.LatLng(lat, long));
}

function createUser(name){
  var user = new Object();

  //affect the name
  user.name = name;

  // crearte the marker
  var marker = new google.maps.Marker({ map:map });

  // Img management
  if(name === 'lj'){
    marker.setIcon('./img/tuile_lj.png')
  }else{
    marker.setIcon('./img/tuile_ns.png')
  }

  // affect set marker
  user.marker = marker;

  return user;
}



function updateIndicator(name,hr,speed,distance){
  if(name === 'lj'){
    // incrmeent the display token
    countLJ++;
    // Update graph
    window.tabHrLj.addData([hr], "");
    window.tabSpeedLj.addData([speed], "");
    updateChartData(window.tabDistLj,distance);
    // if there is already 10 value , we delete the first value
    if(countLJ > 10){
      window.tabHrLj.removeData();
      window.tabSpeedLj.removeData();
    }
    //Update graph
    window.tabHrLj.update();
    window.tabSpeedLj.update();
    //Update labels
    if(hr != null){
      document.getElementById('hr_lj').textContent = hr + ' BPM';
    }

    if(speed != null){
      document.getElementById('speed_lj').textContent = speed + ' km/h';
    }

    if(distance != null){
      document.getElementById('distance_lj').textContent = distance + ' mètres';
    }

  }else{
    // incrmeent the display token
    countML++;
    // Update graph
    window.tabHrMl.addData([hr], "");
    window.tabSpeedMl.addData([speed], "");
    updateChartData(window.tabDistMl,distance);
    // if there is already 10 value , we delete the first value
    if(countML > 10){
      window.tabHrMl.removeData();
      window.tabSpeedMl.removeData();
    }
    //update graph
    window.tabSpeedMl.update();
    window.tabHrMl.update();

    //Update labels if necessary
    if(hr != null){
      document.getElementById('hr_ml').textContent = hr + ' BPM';
    }

    if(speed != null){
      document.getElementById('speed_ml').textContent = speed + ' km/h';
    }

    if(distance != null){
      document.getElementById('distance_ml').textContent = distance + ' métres';
    }

  }


}


////////////////////////////////////////////////////////////////////
////////////// /GMAPS ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
////////////// /Graph ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
var data = {
  labels: [
  ],
  datasets: [
    {
        fillColor: "#0b0f1a",
        strokeColor: "rgba(172, 12, 14, 0.9)",
        pointColor: "rgba(172, 12, 14, 0.9)",
        pointStrokeColor: "rgba(249, 12, 14, 0.9)",
        pointHighlightFill: "rgba(249, 12, 14, 0.9)",
        pointHighlightStroke: "rgba(249, 12, 14, 0.9)",
      data: []
    },
  ]
};

////////////////////////////////////////////////////////////////////
////////////// /Graph ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
////////////// table_data //////////////////////////////////////////
////////////////////////////////////////////////////////////////////
function addDataKm(nbk,user,time,tklk,speedlk,hrlk)
{
  var newRow = document.createElement('tr');
//  newRow.innerHTML = '  <th scope="row">'+nbk+'</th>  <td>'+time.h+'h'+time.m+'m'+time.s+'s</td>   <td>'+tklk.h+'h'+tklk.m+'m'+tklk.s+'s</td>  <td>'+speedlk+'</td>   <td>'+hrlk+'</td>';
  newRow.innerHTML = '  <th scope="row">'+nbk+'</th> <td>'+tklk.h+':'+tklk.m+':'+tklk.s+'</td>  <td>'+time.h+':'+time.m+':'+time.s+'</td>   ';
  if(user === 'lj'){
    document.getElementById('table_km_lj').appendChild(newRow);
  }else{
    document.getElementById('table_km_ml').appendChild(newRow);
  }
}
////////////////////////////////////////////////////////////////////
////////////// /table_data//////////////////////////////////////////
////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
////////////// chart_data //////////////////////////////////////////
////////////////////////////////////////////////////////////////////
function updateChartData(chart,distance)
{
  chart.removeData();
  chart.removeData();

  var percentToDo
  var percentDone

  if(distance > 500){
   percentDone = Math.round(distance/42195*100);
   percentToDo = 100 - percentDone
 }else{
   percentToDo = 100;
   percentDone = 0;

 }

  chart.addData({
    value: percentToDo,
    color:"#f35146",
    highlight: "#f35146",
    label: "A faire en %"
  });

  chart.addData({
    value: percentDone,
    color: "#cbeb2e",
    highlight: "#cbeb2e",
    label: "Fait en %"
  });

  chart.update();

}
////////////////////////////////////////////////////////////////////
////////////// /chart_data//////////////////////////////////////////
////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////
////////////// Common ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
google.maps.event.addDomListener(window, 'load', mapInitialize);

window.onload = function(){
  var ctx = document.getElementById("tab_hr_ml").getContext("2d");
  window.tabHrMl = new Chart(ctx).Line(data, {
    scaleShowGridLines : true,
    responsive : true,
    bezierCurve: true,
    scaleLineColor: "rgba(255, 255, 255, 1)",
    showScale: true,
    scaleOverride: true,
    scaleSteps: 7,
    scaleStepWidth: 20,
    scaleStartValue: 60,

  });

  var ctx = document.getElementById("tab_speed_ml").getContext("2d");
  window.tabSpeedMl = new Chart(ctx).Line(data, {
        scaleShowGridLines : true,
    responsive : true,
    bezierCurve: true,
    scaleLineColor: "rgba(255, 255, 255, 1)",
    showScale: true,
    scaleOverride: true,
    scaleSteps: 9,
    scaleStepWidth: 2,
    scaleStartValue: 0,

  });

  var ctx = document.getElementById("tab_dist_ml").getContext("2d");
  window.tabDistMl = new Chart(ctx).Doughnut(null, {
    responsive : true,
    animationSteps: 1,
    animateScale : false,
    });


  var ctx = document.getElementById("tab_hr_lj").getContext("2d");
  window.tabHrLj = new Chart(ctx).Line(data, {
    responsive : true,
    bezierCurve: true,
    scaleLineColor: "rgba(255, 255, 255, 1)",
    showScale: true,
    scaleOverride: true,
    scaleSteps: 7,
    scaleStepWidth: 20,
    scaleStartValue: 60,
  });

  var ctx = document.getElementById("tab_speed_lj").getContext("2d");
  window.tabSpeedLj = new Chart(ctx).Line(data, {
    responsive : true,
    bezierCurve: true,
    scaleLineColor: "rgba(255, 255, 255, 1)",
    showScale: true,
    scaleOverride: true,
    scaleSteps: 9,
    scaleStepWidth: 2,
    scaleStartValue: 0,
  });

  var ctx = document.getElementById("tab_dist_lj").getContext("2d");
  window.tabDistLj = new Chart(ctx).Doughnut(null, {
      responsive : true,
      animationSteps: 1,
      animateScale : false,

    });

    clock_ml = $('.marathon_clock_ml').FlipClock({
      autoStart : false
    });

    clock_lj = $('.marathon_clock_lj').FlipClock({
      autoStart : false
    });



    /**************/
    /** Socket ****/
    /**************/

    var socket = io.connect('/');

    socket.on('init_data_table_lj', function(data) {
      //init the tab
      var tableDataLj = document.getElementById('table_km_lj');
      while(tableDataLj.childNodes.length>2){tableDataLj.removeChild(tableDataLj.lastChild);}

      //push the data
      for (index = 1; index < data.length; ++index) {
         if(data[index] != null){
           addDataKm(index,'lj',data[index][0],data[index][1],data[index][2],data[index][3]);
          }
       }
    })

    socket.on('init_data_table_ml', function(data) {
      //init the tab
      var tableDataMl = document.getElementById('table_km_ml');
      while(tableDataMl.childNodes.length>2){tableDataMl.removeChild(tableDataMl.lastChild);}

      //push the data
      for (index = 1; index < data.length; ++index) {
        if(data[index] != null){
         addDataKm(index,'ml',data[index][0],data[index][1],data[index][2],data[index][3]);
       }
      }
    })

    socket.on('add_marker', function(data) {
      updateMarker(data.user,data.lat,data.long);
      updateIndicator(data.user,data.hr,data.speed,data.distance);
    })

    socket.on('add_data_table', function(data) {
      addDataKm(data.nbk,data.user,data.time,data.tklk,data.speedlk,data.hrlk);
    })


    socket.on('init_value', function(data) {
      updateChartData(window.tabDistMl,data.distanceML);
      updateChartData(window.tabDistLj,data.distanceLJ);
    })


    socket.on('start_clock_lj', function(data) {
      clock_lj.start();
    })

    socket.on('start_clock_ml', function(data) {
      clock_ml.start();
    })


    socket.on('stop_clock_lj', function(data) {
      clock_lj.stop();
    })

    socket.on('stop_clock_ml', function(data) {
      clock_ml.stop();
    })


    socket.on('start_message', function(data) {
      document.getElementById('message').textContent = data.message;

    })

    socket.on('stop_message', function(data) {
      document.getElementById('message').textContent = "";
    })

    socket.on('init_clock_lj', function(data) {
      clock_lj.setTime(data.timer);
      if(!data.finish){
          clock_lj.start();
      }
    })

    socket.on('init_clock_ml', function(data) {
      clock_ml.setTime(data.timer);
      if(!data.finish){
          clock_ml.start();
      }
    })


    /*********SOCKET**********/
}
