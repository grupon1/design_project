// Obtener los elementos donde se va a colocar la informacion
const latID = document.getElementById('latID');
const longID = document.getElementById('longID');
const dateID = document.getElementById('dateID');
const timeID = document.getElementById('timeID');

const polylineCoords =  [];


const polyline = L.polyline([[0,0]],{color:'red',opacity:1}).addTo(map);
const marcador = L.marker([0, 0]).addTo(map);

const deletePolyline = () => {
    polylineCoords = [];   
}

const showData = async (resetPolyline) => {
    const carro = document.getElementById("inputcarro").value;  
    fetch('/data?carro=${carro}', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    },
    ).then(response => {
        if (response.ok) {
            response.json().then(json => {
                // Obtenemos informacion de la base de datos
                const lastInfo = json[0];
                // Se coloca la informacion en los elementos seleccionados al comienzo del codigo.
                latID.textContent = lastInfo.lat;
                longID.textContent = lastInfo.lng;
                
                try {
                    dateID.textContent = lastInfo.date.split('T')[0];
                    timeID.textContent = lastInfo.date.split('T')[1].split('.')[0];
                } catch (error) {
                    // console.error(error);
                }
                    
                // Se modifica la coordenada del marcador
                map.flyTo([lastInfo.lat,lastInfo.lng],13);
                marcador.setLatLng([lastInfo.lat,lastInfo.lng])
                // Se va agregando el par de coordenadas al vector de la polilinea
                polylineCoords.push([lastInfo.lat,lastInfo.lng])
                // Se actualizan las coordenadas de la polilinea
                polyline.setLatLngs(polylineCoords);
            });
        }
    });
    if ( resetPolyline == true ) {
        deletePolyline();
    }
};
showData();

const timer = setInterval(() => {
    showData(); 
}, 5000);