// Initialize the map centered on Shiraz, Iran
const map = L.map('map').setView([33.651208, 52.998047], 5);

// Base Map Layers - These are the different map styles users can choose from
const baseLayers = {
  "Street Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map),
  
  "Topographic": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; OpenStreetMap contributors'
  }),
  
  "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: '© Esri'
  })
};

// FeatureGroup to store the drawn items (geometries like markers, polygons, etc.)
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Iran's largest provinces as GeoJSON features with points representing their capitals
const iranLargestProvinces = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "province": "Kerman",
        "area_km2": 183285,
        "capital": "Kerman",
        "rank": 1
      },
      "geometry": {
        "type": "Point",
        "coordinates": [57.08, 30.28] // Kerman city coordinates
      }
    },
    {
      "type": "Feature",
      "properties": {
        "province": "Sistan and Baluchestan",
        "area_km2": 181785,
        "capital": "Zahedan",
        "rank": 2
      },
      "geometry": {
        "type": "Point",
        "coordinates": [60.86, 29.50] // Zahedan coordinates
      }
    },
    {
      "type": "Feature",
      "properties": {
        "province": "Fars",
        "area_km2": 122608,
        "capital": "Shiraz",
        "rank": 3
      },
      "geometry": {
        "type": "Point",
        "coordinates": [52.53, 29.61] // Shiraz coordinates
      }
    },
    {
      "type": "Feature",
      "properties": {
        "province": "Khorasan Razavi",
        "area_km2": 118854,
        "capital": "Mashhad",
        "rank": 4
      },
      "geometry": {
        "type": "Point",
        "coordinates": [59.60, 36.26] // Mashhad coordinates
      }
    },
    {
      "type": "Feature",
      "properties": {
        "province": "Isfahan",
        "area_km2": 107029,
        "capital": "Isfahan",
        "rank": 5
      },
      "geometry": {
        "type": "Point",
        "coordinates": [51.67, 32.65] // Isfahan coordinates
      }
    }
  ]
};

// Add province markers to the map
const LargestProvinces = L.geoJSON(iranLargestProvinces, {
  pointToLayer: (feature, latlng) => {
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: '#3388ff',  // Blue color for all markers
      color: '#000',         // Black border
      weight: 1,             // Border width
      fillOpacity: 0.8       // Transparency of the fill
    }).bindPopup(`
      <b>Province:</b> ${feature.properties.province}<br>
      <b>Capital:</b> ${feature.properties.capital}<br>
      <b>Area:</b> ${feature.properties.area_km2.toLocaleString()} km²<br>
      <b>Rank by size:</b> ${feature.properties.rank}
    `);
  }
}).addTo(map);

// Add a scale control to the map for measurement
L.control.scale({
  imperial: false,
  metric: true
}).addTo(map);

// Display the mouse position on the map
document.addEventListener('DOMContentLoaded', function() {
  const mousePositionControl = L.control({ position: 'bottomleft' });

  mousePositionControl.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'mouse-position');
    div.innerHTML = 'Move mouse over map';
    return div;
  };

  mousePositionControl.addTo(map);

  map.on('mousemove', function(e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    document.querySelector('.mouse-position').innerHTML = `Lat: ${lat}, Lng: ${lng}`;
  });
});

// Basic Drawing Tools Setup (Draw polygons, lines, etc.)
const drawControl = new L.Control.Draw({
  draw: {
    polyline: true,
    polygon: true,
    rectangle: true,
    circle: true,
    circlemarker: true,
    marker: true
  },
  edit: {
    featureGroup: drawnItems,  // Allow editing of drawn items
    remove: true  // Enable removal of drawn items
  }
});

// Add the draw control to the map
map.addControl(drawControl);

// Event handlers for drawing actions
map.on('draw:created', function(e) {
  drawnItems.addLayer(e.layer);  // Add the drawn item to the map
});

map.on('draw:edited', function(e) {
  const layers = e.layers;
  layers.eachLayer(function(layer) {
    // Handle the edited layers if needed
  });
});

// Layer Control Setup - Allows users to toggle between different layers
const overlayMaps = {
  "5 Largest Provinces": LargestProvinces,
  "User Drawings": drawnItems,
};

// Iran Provinces WMS Layer (GeoServer)
let iranProvincesLayer;

iranProvincesLayer = L.tileLayer.wms("http://localhost:8080/geoserver/iran_provinces/wms", {
  layers: 'iran_provinces:province',   // GeoServer layer name
  // styles: 'provinces',                 // Style name from GeoServer
  format: 'image/png',
  transparent: true,
}).on('tileerror', function(errorEvent) {
  console.error('Tile load error:', errorEvent);
}).addTo(map);  // Add the WMS layer to the map

// Check if WMS layer was loaded and add it to the layer control
if (iranProvincesLayer) {
  overlayMaps["Iran Provinces"] = iranProvincesLayer;
}

// Layer control that allows toggling between base and overlay layers
L.control.layers(baseLayers, overlayMaps, {
  position: 'topright',
  collapsed: false  // Keep the layer control expanded
}).addTo(map);
