const initialRange = document.getElementById('range');
initialRange.value = 1;
let markers = {};
const markersName = "marcador"

const circle = L.circle([11, -74.80355101913315], {radius: 1000, }).addTo(map);
circle.on({
    mousedown: function () {
      map.on('mousemove', function(e) {
        circle.setLatLng(e.latlng);
        setRange();
      });
    },
    click: function () {
      map.removeEventListener();
    }
  });

const showMarkers = async (coords1,coords2) => {
  const Latitud1 = coords1.lat;
  const Longitud1 = coords1.lng;
  const Latitud2 = coords2.lat;
  const Longitud2 = coords2.lng;
  for (marker in markers) {
    console.log(marker)
    // map.removeLayer(markers[marker]);
  } 
  fetch(`/Rangos?Latitud1=${Latitud1}&Latitud2=${Latitud2}&Longitud1=${Longitud1}&Longitud2=${Longitud2}`, {
    method: 'GET',
    headers: {
        Accept: 'application/json',
    },
  },
  ).then(response => {
      console.log(response)
      if (response.ok) {
          response.json().then(json => {
              const info = json;
              for (let i = 0; i < info.length; i+=30) {
                markers[markersName+i] = L.marker([info[i].lat, info[i].lng]).bindPopup(`Fecha: ${info[i].date.split("T").join(" ").split(".")[0]}`).addTo(map);
              }
          });
      }
  });
}

const setRange = () => {
  const range = document.getElementById('range').value;
  const metersRange = range * 300;
  circle.setRadius(metersRange);
}

const button = () => {
  const coords1 = circle.getBounds()._southWest;
  const coords2 = circle.getBounds()._northEast;
  showMarkers(coords1,coords2);
}