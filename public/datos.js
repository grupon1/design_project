 // Usamos selector para asignar el valor de la fila en un id
 
 Latitud = document.getElementById('Latitud')
 Longitud = document.getElementById('Longitud')
 Fecha = document.getElementById('Fecha')
 Hora = document.getElementById('Hora')  


 // crea un long polling para simular un socket y pedir los datos periodicamente con un intervalos de 5seg
setInterval(() => {
   fetch('Conexion.php')    // llamado al archivo de .php para obtener los valores de la base de datos en MySQL
  .then(response => response.json())  // convierte la promesa del dato de fetch() a JSON
  .then(data => {                      // manejo de los datos obtenidos por el fetch 
    console.log(data)
   
    Latitud.innerHTML = data.Latitud
    Longitud.innerHTML = data.Longitud
    Fecha.innerHTML = data.Fecha
    Hora.innerHTML = data.Hora
});
}, 5000);

