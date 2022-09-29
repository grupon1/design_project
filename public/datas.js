// Obtener los elementos donde se va a colocar la informacion
const latID = document.getElementById('latID');
const longID = document.getElementById('longID');
const dateID = document.getElementById('dateID');
const timeID = document.getElementById('timeID');

const polylineCoords =  [];


const polyline = L.polyline([[0,0]],{color:'red',opacity:1}).addTo(map);
const marcador = L.marker([0, 0]).addTo(map);

const showData = async () => {
    fetch('/data', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    },
    ).then(response => {
        if (response.ok) {
            response.json().then(json => {
                const lastInfo = json[0];
                latID.textContent = lastInfo.lat;
                longID.textContent = lastInfo.lng;
                console.log(lastInfo)
                dateID.textContent = lastInfo.date.split('T')[0];
              
                map.flyTo([lastInfo.lat,lastInfo.lng],13);
                marcador.setLatLng([lastInfo.lat,lastInfo.lng])
                polylineCoords.push([lastInfo.lat,lastInfo.lng])
                polyline.setLatLngs(polylineCoords);
            });
        }
    });
};
showData();

const timer = setInterval(() => {
    showData();
}, 5000);