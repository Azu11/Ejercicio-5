var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>' +
    "contributors",
  maxZoom: 18,
});

var streets = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoidG9xdWlub3ZpYyIsImEiOiJjbGdiZ3VhZmMwaGdnM2Vud2Z2aWJjbnBiIn0.0D301Nbyl2uxrRs5Iic0mA",
  }
);

//Mapa
var map = L.map("map", {
  center: [1.6202, -75.6043],
  zoom: 4,
  layers: [osm],
});

//Minimapa
var base = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>' +
    " contributors",
});

var minimap = new L.control.minimap(base, {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft",
}).addTo(map);

new L.control.scale({ imperial: false }).addTo(map);

//Paises
function getColorPais(d) {
  return d > 100000000
    ? "#800026"
    : d > 50000000
    ? "#BD0026"
    : d > 20000000
    ? "#E31A1C"
    : d > 10000000
    ? "#FC4E2A"
    : d > 5000000
    ? "#FD8D3C"
    : d > 2000000
    ? "#FEB24C"
    : d > 1000000
    ? "#FED976"
    : "#FFEDA0";
}

function Estilolineapaises(feature) {
  return {
    fillColor: getColorPais(feature.properties.pop_est),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
}

function Interaccion(feature, layer) {
  if (feature.properties && feature.properties.name) {
    var popEstFormatted = feature.properties.pop_est.toLocaleString("es-CO");
    layer.bindPopup(
      "Pais: " +
        feature.properties.name +
        "<br>" +
        "Poblacion: " +
        popEstFormatted
    );
  }
}

var Estilopaises = {
  color: "#7a0053",
  weight: 3,
  opacity: 0.7,
};

//Departamentos
function getColordep(d) {
  return d > 100000000000
    ? "#600be0"
    : d > 50000000000
    ? "#02b4fa"
    : d > 20000000000
    ? "#f27f13"
    : d > 30000000000
    ? "#f213a0"
    : "#3002c7";
}

function Estilolineadepartamentos(feature) {
  return {
    fillColor: getColordep(feature.properties.SHAPE_AREA),
    weight: 2,
    opacity: 2,
    color: "green",
    dashArray: "3",
    fillOpacity: 0.8,
  };
}

function InteraccionDep(feature, layer) {
  if (feature.properties && feature.properties.NOM_DEPART) {
    var shapeareaFormatted =
      feature.properties.SHAPE_AREA.toLocaleString("es-CO");
    layer.bindPopup(
      "Departamento: " +
        feature.properties.NOM_DEPART +
        "<br>" +
        "Area: " +
        shapeareaFormatted
    );
  }
}

var Estilodepartamento = {
  color: "#16c702",
  weight: 3,
  opacity: 0.8,
};

//Ciudades
var grupoMarcadores = L.markerClusterGroup();

function getColorCiudades(d) {
  return d == "N" ? "#ffffff" : d == "S" ? "#232424" : "#38383a";
}

function EstiloCiudades(feature) {
  return {
    color: getColorCiudades(feature.properties.CAPITAL),
    radius: 7,
  };
}

const ran = (feature, latlng) =>
  grupoMarcadores.addLayer(
    L.circleMarker(latlng, EstiloCiudades(feature)).bindPopup(
      feature.properties.CIUDAD
    )
  );

L.control.scale().addTo(map);

//Control de Capas
var CapaCiudades = L.layerGroup();
var CapaDepartamento = L.layerGroup();
var CapaPaises = L.layerGroup();

CapaCiudades.addLayer(grupoMarcadores);

L.geoJson(pais, {
  style: Estilolineapaises,
  onEachFeature: Interaccion,
}).addTo(CapaPaises);

L.geoJson(departamento, {
  style: Estilolineadepartamentos,
  onEachFeature: InteraccionDep,
}).addTo(CapaDepartamento);

L.geoJson(ciudad, {
  pointToLayer: ran,
}).addTo(CapaCiudades);

var baseMaps = {
  "<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Openstreetmap_logo.svg/80px-Openstreetmap_logo.svg.png'height=15px, width=15px /> OpenStreetMap":
    osm,
  "<img src='https://upload.wikimedia.org/wikipedia/commons/1/1f/Mapbox_logo_2019.svg'height=15px, width=15px /> MapBox":
    streets,
};

var overlayMaps = {
  "<img src='https://secure.webtoolhub.com/static/resources/icons/set20/309ee4e2927.png'height=15px, width=15px /> Paises":
    CapaPaises,
  "<img src='https://secure.webtoolhub.com/static/resources/icons/set102/52c850e1.png' height=15px, width=15px /> Departamentos":
    CapaDepartamento,
  "<img src='https://secure.webtoolhub.com/static/resources/icons/set109/126a35e5.png' height=15px, width=15px /> Ciudades":
    CapaCiudades,
};

var layerControl = L.control
  .layers(baseMaps, overlayMaps, { collapsed: true })
  .addTo(map);

map.addControl(layerControl);
