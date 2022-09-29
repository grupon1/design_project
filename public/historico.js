const today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1; //enero es 0!
let yyyy = today.getFullYear();
let hora1 = today.getHours();
let minutes = today.getMinutes();

dd < 10 ? dd = "0" + dd : dd = dd;
mm < 10 ? mm = "0" + mm : mm = mm;
hora1 < 10 ? hora1 = "0" + hora1 : hora1 = hora1;
minutes < 10 ? minutes = "0" + minutes : minutes = minutes;

const hora = hora1 + ":" + minutes;

const currentDate = yyyy + "-" + mm + "-" + dd + "T" + hora;

const startDate = document.getElementById("ifecha");
const endDate = document.getElementById("ffecha");

startDate.max = currentDate;
endDate.max = currentDate;

startDate.addEventListener("click", async () => {
    endDate.value == '' ? startDate.max = currentDate:startDate.max = endDate.value;
})
endDate.addEventListener("click", async () => {
    endDate.min = startDate.value;
})
const polyline = L.polyline([[0,0]],{color:'rgb(28, 40, 92)',opacity:1}).addTo(map);
const showRecordInfo = async () => {
    const ifecha = document.getElementById('ifecha').value.split('T').join(' ');
    const ffecha = document.getElementById('ffecha').value.split('T').join(' ');
    
    fetch(`/?ifecha=${ifecha}&ffecha=${ffecha}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    },
    ).then(response => {
        if (response.ok) {
            response.json().then(json => {
                const info = json;
                // Se crea un vector que va a contener las coordenadas de la polilinea
                const polylineCoords =  [];
                // Se rellena el vector con la informacion obtenida de la base de datos                
                for (let i = 0; i < info.length; i++) {
                    polylineCoords[i] = [info[i].Latitud,info[i].Longitud]
                }
                console.log(polylineCoords);
                // Se traza la polilinea
                polyline.setLatLngs(polylineCoords)
            });
        }
    });
};