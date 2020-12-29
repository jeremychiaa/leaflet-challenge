// Creating map object
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// All earthquakes in the past day
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Colour selection
var colours = ['#90EE90', '#FFFF00', '#fed8b1', '#FFA500', '#FF8C00', '#8B0000'];

// Earthquake magnitudes
var magnitudes = ['0-1','1-2','2-3','3-4','4-5', '5+'];

// Function to determine colour based on earthquake's magnitude
var chooseColour = (magnitude) => {
    if (magnitude < 1) {
      return colours[0];
    } else if (magnitude >=1 && magnitude < 2) {
      return colours[1];
    } else if (magnitude >= 2 && magnitude < 3) {
      return colours[2];
    } else if (magnitude >=3 && magnitude < 4) {
      return colours[3];
    } else if (magnitude >=4 && magnitude < 5) {
      return colours[4];
    } else if (magnitude >= 5) {
      return colours[5];
    }
  }

// Function to determine marker size based on earthquake's magnitude
var markerSize = (magnitude) => {
    return magnitude * 4;
  }

var geojsonMarkerOptions = {
    radius: 8,
    weight: 1,
    opacity: 1,
};

// Grab data with d3