var LOCATIONDATA;
var HAVELOCATION = false;

function initializeMap() {

  // To Do: Check Browser for SVG compatibility

  // Disable panning on mobile
  var isDraggable = $(document).width() > 480 ? true : false;
  var position = getLocationByIP();

  if(HAVELOCATION) {
    var initialZoom = 8;
  } else {
    var initialZoom = $(document).width() > 480 ? 4 : 3;
  }

  // Set position and interaction controls for map
  var mapOptions = {
    zoom: initialZoom,
    center: new google.maps.LatLng(position[0], position[1]),
    draggable: isDraggable,
    scrollwheel: false
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var panelDiv = document.getElementById('location-list');

  var dataFeed = new BCBranchesDataSource();
  
  var view = new storeLocator.View(map, dataFeed, {
    markerIcon: '../images/map-icon-green.svg',
    geolocation: false // Set to true to use HTML5 geolocation (user will see location request in browser)
  });

  new storeLocator.Panel(panelDiv, {
    locationSearchLabel: 'Find a Center Near You',
    featureFilter: false,
    directions: false,
    view: view
  });

  // The store locator library shows a "no stores" message if the map is disabled. 
  // Remove the message and replace with a "nearest stores" message
  $('.no-stores').empty().append('The nearest centers to your location:');
}

// Attempt to get approximate location of user by IP address
// If attempt fails, return coordinates to center on USA
// Currently we are using  IP locating only. 
// HTML5 geolacote can be used as a fallback or alternative by turning on geolocation option above.
function getLocationByIP() {
  var lat, lon;
  if (google.loader.ClientLocation) {
    lat = google.loader.ClientLocation.latitude;
    lon = google.loader.ClientLocation.longitude;
    HAVELOCATION = true;
  } else {
    lat = 40;
    lon = -100;
  }
  return([lat,lon]);
}

function setDIVHeight(div) {
  var theDiv = $(div);
  var divTop = theDiv.offset().top;
  var winHeight = $(window).height();
  var divHeight = winHeight - divTop;
  theDiv.height(divHeight);
  theDiv.show();
}

$(window).resize(function () {
  var winWidth = $(window).width();
  if(winWidth >= 992) {
    $('div#map-canvas').show();
    setDIVHeight('div#map-canvas');
    setDIVHeight('div#location-list');
  } else {
    $('div#map-canvas').hide();
  }
});

$(document).ready(function () {
  // Async call loads location data from JSON file
  $.getJSON("locations.json", function(response) {
    LOCATIONDATA = response;
    var winWidth = $(window).width();
    if(winWidth >= 992) {
      // Set 100% height
      setDIVHeight('div#map-canvas');
      setDIVHeight('div#location-list');
    } else {
      $('div#map-canvas').hide();
    }

    initializeMap();
  });
});

// Implements constructor for storeLocator.DataFeed
function BCBranchesDataSource() {
}

BCBranchesDataSource.prototype.getStores = function(bounds, features, callback) {
  var that = this;
  var center = bounds.getCenter();

  var where = '(ST_INTERSECTS(geometry, ' + this.boundsToWkt_(bounds) + ')' +
      ' OR ST_DISTANCE(geometry, ' + this.latLngToWkt_(center) + ') < 20000)';

  $.getJSON("locations.json", function(response) {
    var stores = that.parse_(response);
    that.sortByDistance_(center, stores);
    callback(stores);
  });
};

BCBranchesDataSource.prototype.latLngToWkt_ = function(point) {
  return 'ST_POINT(' + point.lng() + ', ' + point.lat() + ')';
};

BCBranchesDataSource.prototype.boundsToWkt_ = function(bounds) {
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();
  return [
    "ST_GEOMFROMTEXT('POLYGON ((",
    sw.lng(), ' ', sw.lat(), ', ',
    ne.lng(), ' ', sw.lat(), ', ',
    ne.lng(), ' ', ne.lat(), ', ',
    sw.lng(), ' ', ne.lat(), ', ',
    sw.lng(), ' ', sw.lat(),
    "))')"
  ].join('');
};

BCBranchesDataSource.prototype.parse_ = function(data) {
  var stores = [];
  for (var i = 0, branch; branch = data[i]; i++) {

    var position = new google.maps.LatLng(branch.Lat, branch.Lon);

    var title = branch.Name;
    var address = '<p>' + branch.Address + '<br>' + branch.City + ', ' + branch.State + ' ' + branch.Zip + '</p>';
    var url = '<p><a href="' + branch.Slug + '" class="branch-link">View Center Details <i class="fa fa-chevron-right"></i></a></p>'

    var store = new storeLocator.Store(i, position, null, {
      title: title,
      address: address + url
    });
    stores.push(store);
  }
  return stores;
};

/**
 * Sorts a list of given stores by distance from a point in ascending order.
 * Directly manipulates the given array (has side effects).
 * @private
 * @param {google.maps.LatLng} latLng the point to sort from.
 * @param {!Array.<!storeLocator.Store>} stores  the stores to sort.
 */
BCBranchesDataSource.prototype.sortByDistance_ = function(latLng, stores) {
  stores.sort(function(a, b) {
    return a.distanceTo(latLng) - b.distanceTo(latLng);
  });
};

