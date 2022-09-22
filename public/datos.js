const LatitudID = document.getElementById('LatitudID');
const LongitudID = document.getElementById('LongitudID');
const FechaID = document.getElementById('FechaID');
const HoraID = document.getElementById('HoraID');
const polylineCoords = [];
const polyline = L.polyline([[0,0]],{color:'red',opacity:1}).addTo(map);
const marcador = L.marker([0, 0]).addTo(map);

const showData = async () => {
    const url = window.location;
    const link = url + "data";
    fetch(link, {
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
                dateID.textContent = lastInfo.date.split('T').join(' ').split('.')[0];
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