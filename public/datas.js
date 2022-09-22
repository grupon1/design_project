const latID = document.getElementById('latID');
const longID = document.getElementById('longID');
const dateID = document.getElementById('dateID');
const timeID = document.getElementById('timeID');
const polylineCoords =  [];
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
                latID.textContent = lastInfo.Latitud;
                longID.textContent = lastInfo.Longitud;
                dateID.textContent = lastInfo.date;
                timeID.textContent = lastInfo.time;
                marcador.setLatLng([lastInfo.Latitud,lastInfo.Longitud])
                polylineCoords.push([lastInfo.Latitud,lastInfo.Longitud])
                polyline.setLatLngs(polylineCoords);
            });
        }
    });
};
showData();
const timer = setInterval(() => {
    showData();
}, 5000);