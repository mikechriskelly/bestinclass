var LOCATIONDATA;

function initialize() {

  var infowindow = new google.maps.InfoWindow();

  // To Do: Check Browser for SVG compatibility

  // Disable panning on mobile
  var isDraggable = $(document).width() > 480 ? true : false;
  var initialZoom = $(document).width() > 480 ? 4 : 3;

  // Set position and interaction controls for map
  var mapOptions = {
    zoom: initialZoom,
    center: new google.maps.LatLng(40, -100),
    draggable: isDraggable,
    scrollwheel: false
  };

  // Map marker graphics and options
  var mcOptions = {
    gridsize: 40,
    labelClass: "marker-labels",
    styles: [{
      height: 34,
      url: "../images/map-cluster-circle-1.svg",
      width: 34,
      textColor: "#006838",
      textSize: 14
      },
      {
      height: 44,
      url: "../images/map-cluster-circle-2.svg",
      width: 44,
      textColor: "#006838",
      textSize: 14
      },
      {
      height: 54,
      url: "../images/map-cluster-circle-3.svg",
      width: 54,
      textColor: "#006838",
      textSize: 14
    }],
};

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  var markers = [];
  
  // Convert location data to markers
  for (var i in LOCATIONDATA) {
    var p = LOCATIONDATA[i];
    var latlng = new google.maps.LatLng(p.Lat, p.Lon);
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: p.Name,
      url: '#' + p.Name,
      icon: '../images/map-icon-green.svg'
    });

    // Add marker to array
    markers.push(marker);
 
    // Event handler for infowindow on click
    google.maps.event.addListener(marker, 'click', function() {
      var content = '<a href="' + this.url + '" class="infowindow-link">' + this.title + '</a>';
      infowindow.setContent(content);
      infowindow.open(map, this);
    });
  }
  // Cluster nearby markers
  var mc = new MarkerClusterer(map, markers, mcOptions);
}


// Async call loads location data from JSON file and then initializes map
$.getJSON("locations.json", function(response) {
  LOCATIONDATA = response;
  google.maps.event.addDomListener(window, 'load', initialize);
});

