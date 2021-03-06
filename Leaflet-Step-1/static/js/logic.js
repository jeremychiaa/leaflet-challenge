// Creating map object
var myMap = L.map("map", {
  center: [0,0],
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
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Colour selection
var colours = ['#90EE90', '#FFFF00', '#fed8b1', '#FFA500', '#FF8C00', '#8B0000'];

// Earthquake magnitudes
var categories = ['0-1','1-2','2-3','3-4','4-5', '5+'];

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
d3.json(link, (data) => {

    // Create geojson layer with retrieved data
    L.geoJson(data, {
        pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        // Style each feature
        style: (feature) => {
            return {
                color: "white",
                fillColor: chooseColour(feature.properties.mag),
                fillOpacity: 0.4,
                weight: 1.0,
                radius: markerSize(feature.properties.mag)
            };
        },

        // Call on each feature
        onEachFeature: (feature, layer) => {
            // Set mouse events
            layer.on({
                // Mouse over event
                mouseover: (event) => {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.9
                    });
                },
                // Mouse out event
                mouseout: (event) => {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.4
                    });
                },
            });

            // Pop up with various info on earthquake locations
            layer.bindPopup(
                `
                <h4>${feature.properties.place}</h4>
                <hr>
                <p>Magnitude: ${feature.properties.mag}</p>
                `
            );
        }
    }).addTo(myMap);

    // Add legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend");
        var labels = ["<strong>Magnitude</strong>"];

        for (i = 0; i < categories.length; i++) {
            div.innerHTML += labels.push(
                `<div class="square" style="background:${colours[i]}"></div>${(categories[i] ? categories[i] : '+')}`
            );
        }

        div.innerHTML = labels.join("<br>");
        return div;
    };
    legend.addTo(myMap);
});