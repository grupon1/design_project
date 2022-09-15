const express = require("express");
const path = require("path");
require('dotenv').config();


const data = {
  Longitud: "",
  Latitud: "",
  Hora: "",
  Fecha: "",
  
}

//Conexión de de la rds 

const mysql  = require('mysql2');
const connection = mysql.createConnection({
  user: process.env.user,
  host: process.env.Hostname,
  database: process.env.DB,
  password: process.env.Pass,
  port: "3306"
})  
connection.connect(function (err){
  if(err)throw err;
  console.log("conectado")
})



const insertData = async (Longitud, Latidud, Fecha, Hora) => {
  const dateComplete = Fecha + " " + Hora;  
  const query = `INSERT INTO disen (Longitud, Latitud, Fecha, Hora) VALUES (${Longitud}, ${Latidud}, "${dateComplete}")`;
  console.log(dateComplete)
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
  console.log(process.env.design);
  res.sendFile(path.join(__dirname + "/index.html"));
});


const getRecordInfo = async (Fecha1,Fecha2) => {
  const query = `SELECT * FROM disen WHERE date BETWEEN ${Fecha1} AND ${Fecha2}`;
  const {rows:[{Longitud,Latidud,Fecha}]} = await connection.query(query);
  return {Longitud,Latidud,Fecha}
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

const dgram = require('dgram');
const { Hora } = require("console");
const server = dgram.createSocket('udp4');
server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});
server.on('message', async (msg, senderInfo) => {
  console.log('Messages received ' + msg)
  const mensaje = String(msg).split(",")
  data.Longitud= mensaje[0]
  data.Latitud = mensaje[1]
  data.Fecha = mensaje[2]
  data.Hora = mensaje[3]
  console.table(data)
  insertData(data.Longitud,data.Latitud, data.Fecha,data.Hora);
  server.send(msg, senderInfo.port, senderInfo.address, () => {
    console.log(`Message sent to ${senderInfo.address}:${senderInfo.port}`)
  })
});
server.on('listening', (req, res) => {
  const address = server.address();
  console.log(`UDP server listening on: ${address.address}:${address.port}`);
});


server.bind(3000);
app.listen(9001, () => console.log('Server on port: 9001'));