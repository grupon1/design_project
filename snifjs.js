const express = require("express");
const path = require("path");
const moment = require("moment");
require('dotenv').config();


const data = {
  Longitud: "",
  Latitud: "",
  Hora: "",
  Fecha: "",
  
}

//Conexión de de la rds 

const mysql  = require('mysql');
const connection = mysql.createConnection({
  user: process.env.Rds_user,
  host: process.env.Rds_Hostname,
  database: process.env.Rds_DB,
  password: process.env.Rds_Pass,
  port: "3306"
})  
connection.connect(function (err){
  if (err) {
    console.error('error conecting: ' + err.stack);
    return;
}
else{
    console.log("Connected to DB")
}
})



const insertData = async (Longitud, Latitud, Fecha, Hora) => {
  

  const query = `INSERT INTO disen (Longitud, Latitud, Fecha, Hora) VALUES (${Longitud}, ${Latitud}, "${Fecha}", "${Hora}")`;
  console.log("Complete")
  
  connection.query(query, function(err, result){
    if(err)throw err;
    console.log("insertado")
  })
};
//>>>>>>> main
const app = express();
app.use(express.json())

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
  //res.send("hello world!");
  console.log(process.env.Rds_DB);
  res.sendFile(path.join(__dirname + "/index.html"));
  console.log("enviado a pagina web";
});


const getRecordInfo = async (Fecha1,Fecha2) => {
const query = `SELECT * FROM disen WHERE date BETWEEN ${Fecha1} AND ${Fecha2}`;
const {rows:[{Longitud, Latitud, Fecha, Hora}]} = await connection.query(query);
  return {Longitud, Latitud, Fecha, Hora}

};
app.get("/data", async (req, res) => {
  const query = `SELECT * FROM disen ORDER BY ID DESC LIMIT 1`;
  connection.query(query,(err,result) => {
    if (!err) {
      return res.send(result).status(200);     
    } else {
        console.log(`Ha ocurrido el siguiente ${err}`);
        return res.status(500);
    };
  });
});
app.get("/record", async (req, res) => {
  const info = await getLastLocation()
  res.send(info).status(200); 
});
 app.post('/Historicos'), async (req, res) => {
  let ifecha = req.body.finicial, ffecha = req.body.ffinal
  ifecha = new FechaID(ifecha), ffecha = new FechaID(ffecha)
  ifecha = moment(ifecha).format('YYYY:MM:DD HH:mm:ss')
  ffecha = moment(ffecha).format('YYYY:MM:DD HH:mm:ss')
  query =  `SELECT * FROM disen WHERE date BETWEEN ${ifecha} AND ${ffecha}`
  response = await new Promise((resolve, reject)=>{
    connection.query(query,(e,d)=>{
      if(e)throw e
          else{console.log(query,d)
              resolve(d)
          }
      })
  })
  res.status(200).json({
      response
  })
 }
const dgram = require('dgram');
const { Hora } = require("console");
const server = dgram.createSocket('udp4');
server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});
server.on('message', async (msg, senderInfo) => {
  console.log('Messages received ' + msg)
  const mensaje = String(msg).split(" ")
  data.Longitud= mensaje[0]
  data.Latitud = mensaje[1]
  data.Fecha = mensaje[2]
  data.Hora = mensaje[4]
  console.log(mensaje)
  insertData(data.Longitud,data.Latitud, data.Fecha,data.Hora);
  server.send(msg, senderInfo.port, senderInfo.address, () => {
    console.log(`Message sent to ${senderInfo.address}:${senderInfo.port}`)
  })
});
server.on('listening', (req, res) => {
  const address = server.address();
  console.log(`UDP server listening on: ${address.address}:${address.port}`);
});

//xd
server.bind(9001);
app.listen(9001, () => console.log('Server on port: 9001'));