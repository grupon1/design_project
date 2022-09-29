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
                latID.textContent = lastInfo.Latitud;
                longID.textContent = lastInfo.Longitud;
                console.log(lastInfo)
                dateID.textContent = lastInfo.Fecha;
                timeID.textContent = lastInfo.Hora;
                map.flyTo([lastInfo.Latitud,lastInfo.Longitud],13);
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