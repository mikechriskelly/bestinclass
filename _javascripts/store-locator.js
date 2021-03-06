(function ($) {
  // THIS FILE HAS BEEN MODIFIED TO WORK WITH THE BEST IN CLASS LOCATIONS PAGE
  // CUSTOM MODIFICATIONS ARE NOTED IN COMMENTS -MK
  
  /*
 Copyright 2012 Google Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
  'use strict';
  var e = Math,
    f = "getLocation",
    h = "trigger",
    k = "bindTo",
    l = "removeListener",
    n = "geometry",
    p = "attr",
    q = "getBounds",
    r = "find",
    s = "addListener",
    t = "maps",
    u = "getMap",
    v = "contains",
    w = "push",
    x = "addClass",
    y = "getCenter",
    A = "click",
    B = "distanceTo",
    C = "highlight",
    E = "length",
    F = "prototype",
    G = "getId",
    H = "getMarker",
    I = "setMap",
    J = "append",
    K = "join",
    L = "event";

  function M(a) {
    return function () {
      return this[a]
    }
  }
  var N;

  function O() {}
  window.storeLocator = O;

  function P(a) {
    return a * e.PI / 180
  };

  function Q(a, b) {
    this.b = a;
    this.a = b
  }
  O.Feature = Q;
  Q[F].getId = M("b");
  Q[F].getDisplayName = M("a");
  Q[F].toString = function () {
    return this.getDisplayName()
  };

  function R(a) {
    this.a = [];
    this.b = {};
    for (var b = 0, c; c = arguments[b]; b++) this.add(c)
  }
  O.FeatureSet = R;
  N = R[F];
  N.toggle = function (a) {
    this[v](a) ? this.remove(a) : this.add(a)
  };
  N.contains = function (a) {
    return a[G]() in this.b
  };
  N.getById = function (a) {
    return a in this.b ? this.a[this.b[a]] : null
  };
  N.add = function (a) {
    a && (this.a[w](a), this.b[a[G]()] = this.a[E] - 1)
  };
  N.remove = function (a) {
    this[v](a) && (this.a[this.b[a[G]()]] = null, delete this.b[a[G]()])
  };
  N.asList = function () {
    for (var a = [], b = 0, c = this.a[E]; b < c; b++) {
      var d = this.a[b];
      null !== d && a[w](d)
    }
    return a
  };
  var aa = new R;

  function S(a) {
    this.c = a.tableId;
    this.b = a.apiKey;
    a.propertiesModifier && (this.a = a.propertiesModifier)
  }
  O.GMEDataFeed = S;
  S[F].getStores = function (a, b, c) {
    var d = this,
      g = a[y]();
    a = "(ST_INTERSECTS(geometry, " + ca(a) + ") OR ST_DISTANCE(geometry, " + da(g) + ") < 20000)";
    $.getJSON("https://www.googleapis.com/mapsengine/v1/tables/" + this.c + "/features?callback=?", {
      key: this.b,
      where: a,
      version: "published",
      maxResults: 300
    }, function (a) {
      if (a.error) window.alert(a.error.message), a = [];
      else if (a = a.features) {
        for (var b = [], ba = 0, D; D = a[ba]; ba++) {
          var T = D[n].coordinates,
            T = new google[t].LatLng(T[1], T[0]);
          D = d.a(D.properties);
          b[w](new U(D.id, T, null, D))
        }
        a =
          b
      } else a = [];
      ea(g, a);
      c(a)
    })
  };

  function da(a) {
    return "ST_POINT(" + a.lng() + ", " + a.lat() + ")"
  }

  function ca(a) {
    var b = a.getNorthEast();
    a = a.getSouthWest();
    return ["ST_GEOMFROMTEXT('POLYGON ((", a.lng(), " ", a.lat(), ", ", b.lng(), " ", a.lat(), ", ", b.lng(), " ", b.lat(), ", ", a.lng(), " ", b.lat(), ", ", a.lng(), " ", a.lat(), "))')"][K]("")
  }
  S[F].a = function (a) {
    return a
  };

  function ea(a, b) {
    b.sort(function (b, d) {
      return b[B](a) - d[B](a)
    })
  };

  function V(a, b) {
    this.g = $(a);
    this.g[x]("storelocator-panel");
    this.c = $.extend({
      locationSearch: !0,
      locationSearchLabel: "Where are you?",
      featureFilter: !0,
      directions: !0,
      view: null
    }, b);
    this.l = new google[t].DirectionsRenderer({
      draggable: !0
    });
    this.s = new google[t].DirectionsService;
    fa(this)
  }
  O.Panel = V;
  V.prototype = new google[t].MVCObject;

  function fa(a) {
    a.c.view && a.set("view", a.c.view);
    a.e = $('<form class="storelocator-filter"/>');
    a.g[J](a.e);
    // CUSTOM MODIFICATION
    // Set the content for the panel's heaader and input
    var htmlForm =  
      '<div class="location-search">
        <h2>' + a.c.locationSearchLabel + '</h2>
        <div class="input-group">
          <input type="text" class="form-control btn-light" placeholder="Enter Zip Code or City">
          <span class="input-group-btn"><input class="btn btn-light" type="submit" value="Go!"></span>
        </div>
        <p><a href="all-locations">or view all locations</a></p>
      </div>';

    a.c.locationSearch && (a.i = $(htmlForm), a.e[J](a.i), "undefined" != typeof google[t].places ? ga(a) : a.e.submit(function () {
      var b = $("input", a.i).val();
      a.searchPosition(b)
    }), a.e.submit(function () {
      return !1
    }), google[t][L][s](a, "geocode", function (b) {
      if (b[n]) {
        this.k = b[n].location;
        a.h && W(a);
        var c = a.get("view");
        c[C](null);
        var d = c[u]();
        b[n].viewport ?
          d.fitBounds(b[n].viewport) : (d.setCenter(b[n].location), d.setZoom(13));
        c.refreshView();
        X(a)
      } else a.searchPosition(b.name)
    }));
    if (a.c.featureFilter) {
      a.d = $('<div class="feature-filter"/>');
      for (var b = a.get("view").getFeatures().asList(), c = 0, d = b[E]; c < d; c++) {
        var g = b[c],
          m = $('<input type="checkbox"/>');
        m.data("feature", g);
        $("<label/>")[J](m)[J](g.getDisplayName()).appendTo(a.d)
      }
      a.e[J](a.d);
      a.d[r]("input").change(function () {
        var b = $(this).data("feature"),
          c = a.get("featureFilter");
        c.toggle(b);
        a.set("featureFilter",
          c);
        a.get("view").refreshView()
      })
    }
    a.b = $('<ul class="store-list"/>');
    a.g[J](a.b);
    a.c.directions && (a.a = $('<div class="directions-panel"><form><input class="directions-to"/><input type="submit" value="Find directions"/><a href="#" class="close-directions">Close</a></form><div class="rendered-directions"></div></div>'), a.a[r](".directions-to")[p]("readonly", "readonly"), a.a.hide(), a.h = !1, a.a[r]("form").submit(function () {
      W(a);
      return !1
    }), a.a[r](".close-directions")[A](function () {
      a.hideDirections()
    }), a.g[J](a.a))
  }
  var ha = new google[t].Geocoder;

  function X(a) {
    var b = a.get("view");
    a.r && google[t][L][l](a.r);
    a.r = google[t][L].addListenerOnce(b, "stores_changed", function () {
      a.set("stores", b.get("stores"))
    })
  }
  N = V[F];
  N.searchPosition = function (a) {
    var b = this;
    a = {
      address: a,
      bounds: this.get("view")[u]()[q]()
    };
    ha.geocode(a, function (a, d) {
      d == google[t].GeocoderStatus.OK && google[t][L][h](b, "geocode", a[0])
    })
  };
  N.setView = function (a) {
    this.set("view", a)
  };
  N.view_changed = function () {
    function a() {
      b.clearMarkers();
      X(c)
    }
    var b = this.get("view");
    this[k]("selectedStore", b);
    var c = this;
    this.o && google[t][L][l](this.o);
    this.q && google[t][L][l](this.q);
    this.p && google[t][L][l](this.p);
    b[u]();
    this.o = google[t][L][s](b, "load", a);
    this.q = google[t][L][s](b[u](), "zoom_changed", a);
    this.p = google[t][L][s](b[u](), "idle", function () {
      var a = b[u]();
      c.j ? a[q]()[v](c.j) || (c.j = a[y](), X(c)) : c.j = a[y]()
    });
    a();
    this[k]("featureFilter", b);
    this.f && this.f[k]("bounds", b[u]())
  };

  function ga(a) {
    var b = $("input", a.i)[0];
    a.f = new google[t].places.Autocomplete(b);
    a.get("view") && a.f[k]("bounds", a.get("view")[u]());
    google[t][L][s](a.f, "place_changed", function () {
      google[t][L][h](a, "geocode", this.getPlace())
    })
  }
  N.stores_changed = function () {
    if (this.get("stores")) {
      var a = this.get("view"),
        b = a && a[u]()[q](),
        c = this.get("stores"),
        d = this.get("selectedStore");
      this.b.empty();
      // CUSTOM MODIFICATION
      // Set the display message for when there are no nearby locations
      c[E] ? b && !b[v](c[0][f]()) && this.b[J]('<li class="no-stores"><span class="sorry-no-stores">Sorry, no BC Centers here yet!<br>Nearest centers are listed below.</span></li>') : this.b[J]('<li class="no-stores"><span class="sorry-no-stores">Sorry, no BC Centers here yet!<br>Nearest centers are listed below.</span></li>');
      //c[E] ? b && !b[v](c[0][f]()) && this.b[J]('') : this.b[J]('');
      for (var b = function () {
        a[C](this.store, !0)
      }, g = 0, m = e.min(10, c[E]); g < m; g++) {
        var z = c[g].getInfoPanelItem();
        z.store = c[g];
        d && c[g][G]() ==
          d[G]() && $(z)[x]("highlighted");
        z.t || (z.t = google[t][L].addDomListener(z, "click", b));
        this.b[J](z)
      }
    }
  };
  N.selectedStore_changed = function () {
    $(".highlighted", this.b).removeClass("highlighted");
    var a = this,
      b = this.get("selectedStore");
    if (b) {
      this.m = b;
      this.b[r]("#store-" + b[G]())[x]("highlighted");
      this.c.directions && this.a[r](".directions-to").val(b.getDetails().title);
      var c = a.get("view").getInfoWindow().getContent(),
        // CUSTOM MODIFICATION
        // Directions don't work in this implementation.
        // Replace directions with link to Center Webpage and disable action events so it is a plain link
        //d = $("<a/>").text("Directions")[p]("href", "#")[x]("action")[x]("directions"),
        d = $("<a/>").text("Center Webpage")[p]("href",b.getDetails().slug)[x]("action"),
        g = $("<a/>").text("Zoom here")[p]("href", "#")[x]("action")[x]("zoomhere"),
        m = $("<a/>").text("Street view")[p]("href", "#")[x]("action")[x]("streetview");

      // d[A](function () {    
      //   a.showDirections();     
      //   return !1     
      // }); 
      g[A](function () {
        a.get("view")[u]().setOptions({
          center: b[f](),
          zoom: 16
        })
      });
      m[A](function () {
        var c = a.get("view")[u]().getStreetView();
        c.setPosition(b[f]());
        c.setVisible(!0)
      });
      $(c)[J](d)[J](g)[J](m)
    }
  };
  N.hideDirections = function () {
    this.h = !1;
    this.a.fadeOut();
    this.d.fadeIn();
    this.b.fadeIn();
    this.l[I](null)
  };
  N.showDirections = function () {
    var a = this.get("selectedStore");
    this.d.fadeOut();
    this.b.fadeOut();
    this.a[r](".directions-to").val(a.getDetails().slug);
    this.a.fadeIn();
    W(this);
    this.h = !0
  };

  function W(a) {
    if (a.k && a.m) {
      var b = a.a[r](".rendered-directions").empty();
      a.s.route({
        origin: a.k,
        destination: a.m[f](),
        travelMode: google[t].DirectionsTravelMode.DRIVING
      }, function (c, d) {
        if (d == google[t].DirectionsStatus.OK) {
          var g = a.l;
          g.setPanel(b[0]);
          g[I](a.get("view")[u]());
          g.setDirections(c)
        }
      })
    }
  }
  N.featureFilter_changed = function () {
    X(this)
  };

  function Y() {
    this.b = []
  }
  O.StaticDataFeed = Y;
  Y[F].setStores = function (a) {
    this.b = a;
    this.a ? this.a() : delete this.a
  };
  Y[F].getStores = function (a, b, c) {
    if (this.b[E]) {
      for (var d = [], g = 0, m; m = this.b[g]; g++) m.hasAllFeatures(b) && d[w](m);
      ia(a[y](), d);
      c(d)
    } else {
      var z = this;
      this.a = function () {
        z.getStores(a, b, c)
      }
    }
  };

  function ia(a, b) {
    b.sort(function (b, d) {
      return b[B](a) - d[B](a)
    })
  };
  /*

  Latitude/longitude spherical geodesy formulae & scripts
  (c) Chris Veness 2002-2010
  www.movable-type.co.uk/scripts/latlong.html
*/
  function U(a, b, c, d) {
    this.f = a;
    this.d = b;
    this.a = c || aa;
    this.b = d || {}
  }
  O.Store = U;
  N = U[F];
  N.setMarker = function (a) {
    this.e = a;
    google[t][L][h](this, "marker_changed", a)
  };
  N.getMarker = M("e");
  N.getId = M("f");
  N.getLocation = M("d");
  N.getFeatures = M("a");
  N.hasFeature = function (a) {
    return this.a[v](a)
  };
  N.hasAllFeatures = function (a) {
    if (!a) return !0;
    a = a.asList();
    for (var b = 0, c = a[E]; b < c; b++)
      if (!this.hasFeature(a[b])) return !1;
    return !0
  };
  N.getDetails = M("b");

  function ja(a) {
    for (var b = ["title", "address", "phone", "misc", "web"], c = [], d = 0, g = b[E]; d < g; d++) {
      var m = b[d];
      a.b[m] && (c[w]('<div class="'), c[w](m), c[w]('">'), c[w](a.b[m]), c[w]("</div>"))
    }
    return c[K]("")
  }

  function ka(a) {
    var b = [];
    b[w]('<ul class="features">');
    a = a.a.asList();
    for (var c = 0, d; d = a[c]; c++) b[w]("<li>"), b[w](d.getDisplayName()), b[w]("</li>");
    b[w]("</ul>");
    return b[K]("")
  }
  N.getInfoWindowContent = function () {
    if (!this.c) {
      var a = ['<div class="store">'];
      a[w](ja(this));
      a[w](ka(this));
      a[w]("</div>");
      this.c = a[K]("")
    }
    return this.c
  };
  N.getInfoPanelContent = function () {
    return this.getInfoWindowContent()
  };
  var Z = {};
  U[F].getInfoPanelItem = function () {
    var a = this[G]();
    if (!Z[a]) {
      var b = this.getInfoPanelContent();
      Z[a] = $('<li class="store" id="store-' + this[G]() + '">' + b + "</li>")[0]
    }
    return Z[a]
  };
  U[F].distanceTo = function (a) {
    var b = this[f](),
      c = P(b.lat()),
      d = P(b.lng()),
      b = P(a.lat()),
      g = P(a.lng());
    a = b - c;
    d = g - d;
    c = e.sin(a / 2) * e.sin(a / 2) + e.cos(c) * e.cos(b) * e.sin(d / 2) * e.sin(d / 2);
    return 12742 * e.atan2(e.sqrt(c), e.sqrt(1 - c))
  };

  function la() {}
  O.DataFeed = la;
  la[F].getStores = function () {};

  function ma(a, b, c) {
    this.g = a;
    this.f = b;
    this.b = $.extend({
      updateOnPan: !0,
      geolocation: !0,
      features: new R
    }, c);
    na(this);
    google[t][L][h](this, "load");
    this.set("featureFilter", new R)
  }
  O.View = ma;
  ma.prototype = new google[t].MVCObject;

  function oa(a) {
    window.navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition(function (b) {
      b = new google[t].LatLng(b.coords.latitude, b.coords.longitude);
      a[u]().setCenter(b);
      a[u]().setZoom(11);
      google[t][L][h](a, "load")
    }, void 0, {
      maximumAge: 6E4,
      timeout: 1E4
    })
  }

  function na(a) {
    a.b.geolocation && oa(a);
    a.c = {};
    a.a = new google[t].InfoWindow;
    var b = a[u]();
    a.set("updateOnPan", a.b.updateOnPan);
    google[t][L][s](a.a, "closeclick", function () {
      a[C](null)
    });
    google[t][L][s](b, "click", function () {
      a[C](null);
      a.a.close()
    })
  }
  N = ma[F];
  N.updateOnPan_changed = function () {
    this.e && google[t][L][l](this.e);
    if (this.get("updateOnPan") && this[u]()) {
      var a = this,
        b = this[u]();
      this.e = google[t][L][s](b, "idle", function () {
        a.refreshView()
      })
    }
  };
  N.addStoreToMap = function (a) {
    var b = this[H](a);
    a.setMarker(b);
    var c = this;
    b.n = google[t][L][s](b, "click", function () {
      c[C](a, !1)
    });
    b[u]() != this[u]() && b[I](this[u]())
  };
  N.createMarker = function (a) {
    a = {
      position: a[f]()
    };
    var b = this.b.markerIcon;
    b && (a.icon = b);
    return new google[t].Marker(a)
  };
  N.getMarker = function (a) {
    var b = this.c,
      c = a[G]();
    b[c] || (b[c] = this.createMarker(a));
    return b[c]
  };
  N.getInfoWindow = function (a) {
    if (!a) return this.a;
    a = $(a.getInfoWindowContent());
    this.a.setContent(a[0]);
    return this.a
  };
  N.getFeatures = function () {
    return this.b.features
  };
  N.getFeatureById = function (a) {
    if (!this.d) {
      this.d = {};
      for (var b = 0, c; c = this.b.features[b]; b++) this.d[c[G]()] = c
    }
    return this.d[a]
  };
  N.featureFilter_changed = function () {
    google[t][L][h](this, "featureFilter_changed", this.get("featureFilter"));
    this.get("stores") && this.clearMarkers()
  };
  N.clearMarkers = function () {
    for (var a in this.c) {
      this.c[a][I](null);
      var b = this.c[a].n;
      b && google[t][L][l](b)
    }
  };
  N.refreshView = function () {
    var a = this;
    this.f.getStores(this[u]()[q](), this.get("featureFilter"), function (b) {
      var c = a.get("stores");
      if (c)
        for (var d = 0, g = c[E]; d < g; d++) google[t][L][l](c[d][H]().n);
      a.set("stores", b)
    })
  };
  N.stores_changed = function () {
    for (var a = this.get("stores"), b = 0, c; c = a[b]; b++) this.addStoreToMap(c)
  };
  N.getMap = M("g");
  N.highlight = function (a, b) {
    // CUSTOM MODIFICTION
    // Added IF statement around function calls so that store selection functions are only called if map is displayed
    // This prevents buggy behavior on small screens in which panelView list items are rearranged when user clicks on a store
    if($('div#map-canvas').is(":visible")) {
      var c = this.getInfoWindow(a);
      a ? (c = this.getInfoWindow(a), a[H]() ? c.open(this[u](), a[H]()) : (c.setPosition(a[f]()), c.open(this[u]())), b && this[u]().panTo(a[f]()), this[u]().getStreetView().getVisible() && this[u]().getStreetView().setPosition(a[f]())) : c.close();
      this.set("selectedStore", a)
    }
  };
  N.selectedStore_changed = function () {
    google[t][L][h](this, "selectedStore_changed", this.get("selectedStore"))
  };
})(jQuery)