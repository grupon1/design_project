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
  user: process.env.Rds_user,
  host: process.env.Rds_Hostname,
  database: process.env.Rds_DB,
  password: process.env.Rds_Pass,
  port: "3306"
})  
connection.connect(function (err){
  if(err)throw err;
  console.log("conectado")
})



const insertData = async (Longitud, Latidud, Fecha, Hora) => {
  const dateComplete = Fecha + " " + Hora;  
<<<<<<< HEAD
  const query = `INSERT INTO disen (Longitud, Latitud, Fecha, Hora) VALUES (${Longitud}, ${Latidud}, "${Fecha}, "${Hora})"`;
=======
  const query = `INSERT INTO Datagps (Longitud, Latitud, Fecha, Hora) VALUES (${Longitud}, ${Latidud}, "${dateComplete}")`;
>>>>>>> f90b80ab98190c89e9e9e97b3299ea16dee7e790
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
<<<<<<< HEAD
  const query = `SELECT * FROM disen WHERE date BETWEEN ${Fecha1} AND ${Fecha2}`;
  const {rows:[{Longitud,Latidud,Fecha, Hora}]} = await connection.query(query);
  return {Longitud,Latidud,Fecha, Hora}
=======
  const query = `SELECT * FROM Datagps WHERE date BETWEEN ${Fecha1} AND ${Fecha2}`;
  const {rows:[{Longitud,Latidud,Fecha}]} = await connection.query(query);
  return {Longitud,Latidud,Fecha}
>>>>>>> f90b80ab98190c89e9e9e97b3299ea16dee7e790
};
app.get("/data", async (req, res) => {
  const query = `SELECT * FROM Datagps ORDER BY ID DESC LIMIT 1`;
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
  data.Longitud= mensaje[1]
  data.Latitud = mensaje[2]
  data.Fecha = mensaje[3]
  data.Hora = mensaje[4]
  //console.table(data)
  //insertData(data.Longitud,data.Latitud, data.Fecha,data.Hora);
  server.send(msg, senderInfo.port, senderInfo.address, () => {
    console.log(`Message sent to ${senderInfo.address}:${senderInfo.port}`)
  })
});
server.on('listening', (req, res) => {
  const address = server.address();
  console.log(`UDP server listening on: ${address.address}:${address.port}`);
});

//xdxdxd
server.bind(3000);
app.listen(9001, () => console.log('Server on port: 9001'));
