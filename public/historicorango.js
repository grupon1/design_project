const initialRange = document.getElementById('range');
initialRange.value = 1;
let markers = {};
const markersName = "marcador"
let infoCoords = [];
const listener = function(e) {
  circle.setLatLng(e.latlng);
  setRange();
}


const circle = L.circle([11, -74.80355101913315], {radius: 1000, }).addTo(map);
circle.on({
    /*mousedown: function () {
      map.on('mousemove', function(e) {
        circle.setLatLng(e.latlng);
        setRange();
      });
    },*/
    click: function () {
      if (clicker){
        clicker = false;
        map.removeEventListener('mousemove', listener);
        console.log("click1");
      }else{
        clicker = true;
        map.on('mousemove', listener)
        console.log("click2");
      }
      
    }
  });

const polyline = L.polyline([[0,0]],{color:'rgb(28, 40, 92)',opacity:1}).addTo(map);
let polyLenght = 0;


const showMarkers = async (coords1,coords2) => {
  const lat1 = coords1.lat;
  const lon1 = coords1.lng;
  const lat2 = coords2.lat;
  const lon2 = coords2.lng;
  for (marker in markers) {
    console.log(marker)
  
  } 
  fetch(`/recordRange?lat1=${lat1}&lat2=${lat2}&lon1=${lon1}&lon2=${lon2}`, {
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
              const polylineCoords =  [];
              polyLenght = info.length;
              infoCoords=[];
              for (let i = 0; i < info.length; i++) {
                polylineCoords.push([info[i].lat,info[i].lng])
                infoCoords.push([info[i].lat,info[i].lng,info[i].date.split('T')[0],info[i].date.split('T')[1].split('.')[0]])
              }
              polyline.setLatLngs([polylineCoords])
              const range2 = document.getElementById('range2');
              range2.max = polyLenght;

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
const marcador = L.marker([0, 0]).addTo(map);
const setRange2 = () => {
  const range2 = document.getElementById('range2').value;
  marcador.setLatLng([infoCoords[range2][0],infoCoords[range2][1]])
  marcador.bindPopup(`
    fecha: ${infoCoords[range2][2]}  <br>
    hora: ${infoCoords[range2][3]} 
  `)
}