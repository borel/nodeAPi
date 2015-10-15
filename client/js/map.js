// Initilize the map in NYC with the NYC marathon Data
function mapInitialize() {
  map = new google.maps.Map(document.getElementById("map-canvas"), {
    zoom: 12,
    // nyc   center: new google.maps.LatLng(40.742494, -73.953867)
    center: new google.maps.LatLng(45.764043, 4.835659)
  });
  infowindow = new google.maps.InfoWindow({ content: 'Test' });
  google.maps.event.addListener(map, 'click', function() {
    infowindow.close(map);
  });

  nycMarathonInitialize();
}

// NYX Marathon DATA
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


// Update a maker
function updateMarker(name,lat,long){
  // Take the user
  var user = users[name];
  // If the user dont' exit ; we create one and add to the tab
  if(!user){
    user = createUser(name);
    users[name] = user;
  }
  //On update le marker ( qu(il soit nouveau ou ancien))
  user.marker.setPosition(new google.maps.LatLng(lat, long));
}

// Create user with his name as id
function createUser(name){
  var user = new Object();
  // affect the name
  user.name = name;
  // crearte the marker
  var marker = new google.maps.Marker({ map:map });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(marker.getTitle());
    infowindow.open(map, marker);
  });
  // affect image
  if(name === 'lj'){
    marker.setIcon('./img/LJ.png')
  }else{
    marker.setIcon('./img/ML.png')
  }
  // affect marker to user
  user.marker = marker;
  return user;
}
