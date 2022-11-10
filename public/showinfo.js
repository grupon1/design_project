// Obtener los elementos donde se va a colocar la informacion
const latID = document.getElementById('latID');
const longID = document.getElementById('longID');
const dateID = document.getElementById('dateID');
const timeID = document.getElementById('timeID');


const latID2 = document.getElementById('latID2');
const longID2 = document.getElementById('longID2');
const dateID2 = document.getElementById('dateID2');
const timeID2 = document.getElementById('timeID2');


// Crear vector para guardar coordenadas de la polilinea.
let polylineCoords =  [];
let polylineCoords2 =  [];

// Inicializar marcador y polilinea en la coordenada [0,0], esta coordenada se va 
// actualizando en tiempo real con la informacion de la base de datos.

const polyline1 = L.polyline([[0,0]],{color:'red',opacity:1}).addTo(map);
const marcador1 = L.marker([0, 0]).bindPopup('carro: 1');

const polyline2 = L.polyline([[0,0]],{color:'blue',opacity:1}).addTo(map);
const marcador2 = L.marker([0, 0], {Icon: RedIcon}).bindPopup('carro: 2');

var RedIcon = new L.Icon({
    iconUrl: 'public\marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const deletePolyline = () => {
    polylineCoords = [];
    polylineCoords2 = [];
}

const getcarroInfo = (resetPolyline) => {
    const vehi = document.getElementById('inputCarro').value;
    resetPolyline == true ? deletePolyline() : null
    if (vehi == 2) {
        marcador1.addTo(map)
        marcador2.addTo(map)
        showData('1',polylineCoords,marcador1,polyline1);
        showData('2',polylineCoords2,marcador2,polyline2);
    } else {
        if (vehi == '1') {
            marcador1.addTo(map)
            showData(vehi,polylineCoords,marcador1,polyline1);
            map.removeLayer(marcador2);
        } else {
            marcador2.addTo(map)
            showData(vehi,polylineCoords2,marcador2,polyline2);
            map.removeLayer(marcador1);
        }
    };
};

// funcion para mostrar la informacion de la base de datos
const showData = async (carro,polylineVector,marker,polyline) => {
    // const carro = document.getElementById("inputCarro").value;  
    fetch(`/data?carro=${carro}`, {
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
                if (carro == '1') {
                    latID.textContent = lastInfo.lat;
                    longID.textContent = lastInfo.lng;
                    
                    try {
                        dateID.textContent = lastInfo.date.split('T')[0];
                        timeID.textContent = lastInfo.date.split('T')[1].split('.')[0];
                    } catch (error) {
                        // console.error(error);
                    }
                     
                } else {
                    latID2.textContent = lastInfo.lat;
                    longID2.textContent = lastInfo.lng;
                    
                    
                    try {
                        dateID2.textContent = lastInfo.date.split('T')[0];
                        timeID2.textContent = lastInfo.date.split('T')[1].split('.')[0];
                    } catch (error) {
                        // console.error(error);
                    }
                }

                const carrooption = document.getElementById('inputCarro').value;
                if (carrooption != 2) {
                    map.flyTo([lastInfo.lat,lastInfo.lng],13);
                    if (carro == '1') {
                        dateID2.textContent = '';
                        timeID2.textContent = '';
                        latID2.textContent = '';
                        longID2.textContent = '';
                   
                    } else {
                        dateID.textContent = '';
                        timeID.textContent = '';
                        latID.textContent = '';
                        longID.textContent = '';
                     
                    }
                } else {
                    ;
                };
                // Se modifica la coordenada del marcador
                marker.setLatLng([lastInfo.lat,lastInfo.lng])
                // Se va agregando el par de coordenadas al vector de la polilinea
                polylineVector.push([lastInfo.lat,lastInfo.lng])
                // Se actualizan las coordenadas de la polilinea
                polyline.setLatLngs(polylineVector);
            });
        }
    });
};
// Se ejecuta la funcion por primera vez para mostrar la informacion
getcarroInfo();

// Se configura la ejecucion de la funcion cada cinco segundos
const timer = setInterval(() => {
    getcarroInfo();
}, 6000);