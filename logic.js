// Selectable backgrounds of our map - tile layers:
// grayscale background.
var graymap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoid2hhbGUyMDE4IiwiYSI6ImNqbXNocWJsNTAzdzgzcG9lOXVlb3hndGEifQ.MbwoMjaX7NO3D6Z0GpgQsw");

// satellite background.
var satellitemap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoid2hhbGUyMDE4IiwiYSI6ImNqbXNocWJsNTAzdzgzcG9lOXVlb3hndGEifQ.MbwoMjaX7NO3D6Z0GpgQsw");

// outdoors background.
var outdoors_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoid2hhbGUyMDE4IiwiYSI6ImNqbXNocWJsNTAzdzgzcG9lOXVlb3hndGEifQ.MbwoMjaX7NO3D6Z0GpgQsw");

// map object to an array of layers we created.
var map = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 4.5,
  layers: [graymap_background, satellitemap_background, outdoors_background]
});

// adding one 'graymap' tile layer to the map.
graymap_background.addTo(map);

// layers for two different sets of data, earthquakes and tectonicplates.
var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

// base layers
var baseMaps = {
  Satellite: satellitemap_background,
  Grayscale: graymap_background,
  Outdoors: outdoors_background
};

// overlays 
var overlayMaps = {
  "Fault Lines": tectonicplates,
  "Earthquakes": earthquakes
};

// control which layers are visible.
L
  .control
  .layers(baseMaps, overlayMaps)
  .addTo(map);

// retrieve earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {


  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Define the color of the marker based on the magnitude of the earthquake.
  //function getColor(magnitude) {
    //switch (true) {
      //case magnitude > 5:
        //return "#7a0177";
      //case magnitude > 4:
        //return "#c51b8a";
      //case magnitude > 3:
        //return "#f768a1";
      //case magnitude > 2:
        //return "#fa9fb5";
      //case magnitude > 1:
        //return "#fcc5c0";
      //default:
        //return "#feebe2";
    //}
  //}

  function getColor(d){
    return d > 5 ? "#7a0177":
    d  > 4 ? "#c51b8a":
    d > 3 ? "#f768a1":
    d > 2 ? "#fa9fb5":
    d > 1 ? "#fcc5c0":
             "#feebe2";
  }
  
  // define the radius of the earthquake marker based on its magnitude.

  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 3;
  }

  // add GeoJSON layer to the map
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

  }).addTo(earthquakes);

  earthquakes.addTo(map);


  var legend = L.control({
    position: "bottomleft"
  });


  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");

    //var grades = [0, 1, 2, 3, 4, 5];
    //var colors = [
      //"#feebe2",
      //"#fcc5c0",
      //"#fa9fb5",
      //"#f768a1",
      //"#c51b8a",
      //"#7a0177"
    //];
    
    //for (var i = 0; i < grades.length; i++) {
      //div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        //grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    //}
    //return div;
  //};


  var grades = [0, 1, 2, 3, 4, 5];
  var colors = []

  // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };


  legend.addTo(map);

  // retrive Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(platedata) {
 
      L.geoJson(platedata, {
        color: "red",
        weight: 2
      })
      .addTo(tectonicplates);

      // add the tectonicplates layer to the map.
      tectonicplates.addTo(map);
    });
});
