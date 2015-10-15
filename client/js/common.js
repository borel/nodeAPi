
function updateIndicator(name,hr,speed,distance){
  if(name === 'lj'){
    document.getElementById("lj_hr").textContent = hr;
    document.getElementById("lj_speed").textContent = speed;
    document.getElementById("lj_distance").textContent = distance;

    window.tabHrLj.addData([hr], "");
    window.tabSpeedLj.addData([speed], "");
    window.tabDistLj.addData([distance], "");

    window.tabHrLj.update();
    window.tabSpeedLj.update();
    window.tabDistLj.update();

  }else{
    document.getElementById("ml_hr").textContent = hr;
    document.getElementById("ml_speed").textContent = speed;
    document.getElementById("ml_distance").textContent = distance;

    window.tabHrMl.addData([hr], "");
    window.tabSpeedMl.addData([speed], "");
    window.tabDistMl.addData([distance], "");

    window.tabSpeedMl.update();
    window.tabHrMl.update();
    window.tabDistMl.update();
  }


}

////////////////////////////////////////////////////////////////////
////////////// Socket///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
var socket = io.connect('/');

socket.on('add_marker', function(data) {
  updateMarker(data.user,data.lat,data.long);
  updateIndicator(data.user,data.hr,data.speed,data.distance);
})

socket.on('add_pk', function(data) {
  updateGraph(data.user,data.tk);
})

socket.on('init_pk', function(data) {
  for (index = 0; index < data.tks.length; ++index) {
    window.myBar.addData([data.tks[index][1],data.tks[index][2]], data.tks[index][0]);
  }
})
////////////////////////////////////////////////////////////////////
////////////// /Socket///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
////////////// Common ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
google.maps.event.addDomListener(window, 'load', mapInitialize);

window.onload = function(){
  var ctx = document.getElementById("tab_hr_ml").getContext("2d");
  window.tabHrMl = new Chart(ctx).Line(data, {
    responsive : true,
    bezierCurve: true
  });

  var ctx = document.getElementById("tab_speed_ml").getContext("2d");
  window.tabSpeedMl = new Chart(ctx).Line(data, {
    responsive : true,
    bezierCurve: true
  });

  var ctx = document.getElementById("tab_dist_ml").getContext("2d");
  window.tabDistMl = new Chart(ctx).Line(data, {
    responsive : true,
    bezierCurve: true
  });


  var ctx = document.getElementById("tab_hr_lj").getContext("2d");
  window.tabHrLj = new Chart(ctx).Line(data, {
    responsive : true,
    bezierCurve: true
  });

  var ctx = document.getElementById("tab_speed_lj").getContext("2d");
  window.tabSpeedLj = new Chart(ctx).Line(data, {
    responsive : true,
    bezierCurve: true
  });

  var ctx = document.getElementById("tab_dist_lj").getContext("2d");
  window.tabDistLj = new Chart(ctx).Line(data, {
    responsive : true,
    bezierCurve: true
  });


}
