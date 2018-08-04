var express = require('express');
var mongoose = require('mongoose');
var appRoutes = require('./routes/appRoutes');
var UsuarioRoutes = require('./routes/usuarioRoutes.js');
var LoginRoutes = require('./routes/loginRoutes');
var bodyParser = require('body-parser');

//inicialziar variables
var app = express();

// parse application/x-www-form-urlencoded //configurando el body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//conexion a la db
mongoose.connection.openUri('mongodb://localhost:27017/sici2', (err, res)=>{
    if(err) throw err;
    console.log("base de datos online");
});

//middleware para las rutas
app.use('/login', LoginRoutes);
app.use('/usuarios', UsuarioRoutes);
app.use('/', appRoutes);



//escuchar peticiones
app.listen(3000, ()=>{
    console.log("express server corriendo en pueto 3000 online");
});