var map = {},
myPos = {},
mapOptions = {},
tweetData = {},
my_markers = [],
info_windows = [],
contentStringArray=[],
locationArray = [],
to_delete_array = [],
screen_names_array = [];
google.maps.event.addDomListener(window, 'load', initialize);
map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


//Get tweets from mongoDB
function requestTweets() {
  $.ajax({
    type: 'GET',
    url: '../getTweets',
    //contentType: 'application/json; charset=utf-8',
    success: function(data) {
      console.log("Success requestTweets");
      setMarkers(map, data);
    },
        // Overlay function stuff happens here
    //error: playSound,
    dataType: 'json'
  });
}

//Start stream
function startStream(upper, lower) {

  console.log(upper);
  console.log(lower);
  var locData = [upper.k,lower.j,upper.j,lower.k];
  var dataString = locData[0].toString()+"/"+locData[1].toString()+"/"+locData[2].toString()+"/"+locData[3].toString();
  dataString =  dataString.split('.').join('a');
  dataString = dataString.split('-').join('b');
  dataString = dataString.split('/').join('c');
  console.log(dataString);

  $.ajax({
    type: 'POST',
    // Provide correct Content-Type, so that Flask will know how to process it.
    contentType: 'application/json',
    // Encode your data as JSON.
    //data: dataString,
    // This is the type of data you're expecting back from the server.
    dataType: 'text/html',
    url: '../call/'+dataString,
    success: function (e) {
        console.log(e);
    }
    });
}



function setMarkers(map, locations) {
    console.log("Doing setMarkers");
    var tweetIcon ={
        url: 'images/icons/social-twitter.png',
        size: new google.maps.Size(30, 30),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(15, 15)
        };

    for (var i = 0; i < locations.length; i++) {

        console.log(locations[i]);
        var keyword = locations[i];
        var myLatLng = new google.maps.LatLng(keyword['locationy'], keyword['locationx']);
        locationArray.push(myLatLng);
        contentStringArray.push('<a href="http://twitter.com/'+keyword['user']+'" target="_blank">'+'<b>'+keyword['user']+'</b></a>'+'<br>'+keyword['text']);
        //screen_names_array.push(keyword['user']);
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            animation: google.maps.Animation.BOUNCE,
            icon: tweetIcon,
            title: keyword['time'],
        });
        console.log("made the marker");
        marker.info = new google.maps.InfoWindow({
            content: contentStringArray[i],
            position: locationArray[i],
          });

        my_markers.push(marker);

        google.maps.event.addListener(my_markers[i], 'click', function() {
        this.info.open(map,my_markers[i]);
        });
    }

        setTimeout(function(){
        //requestTweets();
            setClear();
        }, 9850);

    }

function setClear() {
  for (var i = 0; i < my_markers.length; i++) {
    my_markers[i].setMap(null);
  }
  my_markers = [];
  locationArray = [];
  contentStringArray = [];
}


function initialize() {
  var mapOptions = {
    zoom: 11
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      var maininfowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: "You're here!"
      });

      map.setCenter(pos);
      console.log('Bounds:');
      var bounds = map.getBounds()
      var upper = bounds.Da;
      var lower = bounds.va;
      console.log(upper);
      console.log(lower);
      startStream(upper,lower);

    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }

  setInterval(requestTweets, 10000);

}//end of initialize


function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var maininfowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}
