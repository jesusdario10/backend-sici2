var express = require('express');
var mongoose = require('mongoose');

//inicialziar variables
var app = express();

//rutas
app.get('/', (req, res, next)=>{
    res.status(200).json({
       ok:true,
       mensaje:"peticion realizada correctamente"
    })
});
//coneccion a la db
mongoose.connection.openUri('mongodb://localhost:27017/sici2', (err, res)=>{
    if(err) throw err;
    console.log("base de datos online");

})

//escuchar peticiones

app.listen(3000, ()=>{
    console.log("express server corriendo en pueto 3000 online");
});