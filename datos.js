const LatitudID = document.getElementById('LatitudID');
const LongitudID = document.getElementById('LongitudID');
const FechaID = document.getElementById('FechaID');
const HoraID = document.getElementById('HoraID');

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
                LatitudID.textContent = json.Latitud;
                LongitudID.textContent = json.Longitud;
                FechaID.textContent = json.date.split('T').join(' ').split('.')[0];
                FechaID.textContent = json.Hora;
                marcador.setLatitudLongitud([json.Latitud,json.Longitud])
            });
        }
    });
};
showData();
const timer = setInterval(() => {
    showData();
}, 5000);