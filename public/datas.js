const Latitud = document.getElementById('Latitud');
const Longitud = document.getElementById('Longitud');
const Fecha = document.getElementById('Fecha');
const Hora = document.getElementById('Hora');
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
                Latitud.textContent = lastInfo.Latitud;
                Longitud.textContent = lastInfo.Longitud;
                Fecha.textContent = lastInfo.date.split('T').join(' ').split('.')[0];
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