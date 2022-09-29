//EXPORTS

const express = require("express");
const path = require("path");
require('dotenv').config();



const app = express();
app.use(express.json())
app.use(express.static(__dirname + '/public'));

// conexion rds

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
  console.log("connected to DB")
})

//RUTAS WEB

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/historicosFecha", (req, res) => {
  return res.sendFile(path.join(__dirname + "/historico.html"));
});

app.get("/historicosRango", (req, res) => {
  return res.sendFile(path.join(__dirname + "/historicorango.html"));
});




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
  const idate = req.query.idate;
  const fdate = req.query.fdate;

  const query = `SELECT * FROM disen WHERE date BETWEEN STR_TO_DATE( "${idate}" ,"%Y-%m-%d %H:%i:%s") AND STR_TO_DATE( "${fdate}" ,"%Y-%m-%d %H:%i:%s")`;
  connection.query(query,(err, result) => {
    if (!err) {
      return res.send(result).status(200);
    } else {
      console.log(`Ha ocurrido el siguiente ${err}`);
      return res.status(500);
    }
  })
});


app.get("/recordRange", async (req, res) => {
  const lat1 = req.query.lat1;
  const lat2 = req.query.lat2;
  const lon1 = req.query.lon1;
  const lon2 = req.query.lon2;

  const query = `SELECT * FROM disen WHERE (lat BETWEEN "${lat1}" AND "${lat2}") AND (lng BETWEEN "${lon1}" AND "${lon2}")`;
  connection.query(query,(err, result) => {
    if (!err) {
      return res.send(result).status(200);
    } else {
      console.log(`Ha ocurrido el siguiente ${err}`);
      return res.status(500);
    }
  })
});


// ======================== ++ GUARDAR INFO RECIBIDA ++ ===========================

const insertData = async (info) => {
  const lat = info[0];
  const lng = info[1];
  const date = info[3];
  const hour = info[2];
  const dateComplete = date + " " + hour;  
  const query = `INSERT INTO disen (lat, lng, date) VALUES (${lat}, ${lng}, "${dateComplete}")`;
  connection.query(query, function(err, result){
    if(err)throw err;
    console.log("Registro guardado exitosamente.")
  })
};

// ======================== ++ CREAR SOCKET ++ ===========================

const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
socket.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  socket.close();
});
socket.on('message', async (msg, senderInfo) => {
  console.log('Messages received ' + msg)
  const infoMensaje = String(msg).split(",")
  insertData(infoMensaje);
  socket.send(msg, senderInfo.port, senderInfo.address, () => {
    console.log(`Message sent to ${senderInfo.address}:${senderInfo.port}`)
  })
});
socket.on('listening', (req, res) => {
  const address =   socket.address();
  console.log(`UDP server listening on: ${address.address}:${address.port}`);
});

// ======================== ++ INICIAR SOCKET ++ ===========================

socket.bind(3000);

// ======================== ++ INICIAR SERVIDOR ++ ===========================

app.listen(5000, () => console.log('Server on port: 5000'));