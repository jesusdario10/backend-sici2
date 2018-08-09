var express = require('express');
var mongoose = require('mongoose');
var appRoutes = require('./routes/appRoutes');
var UsuarioRoutes = require('./routes/usuarioRoutes.js');
var LoginRoutes = require('./routes/loginRoutes');
var hospitalesRoutes = require('./routes/hospitalesRoutes');
var medicosRoutes = require('./routes/medicoRoutes');
var busquedaGeneralRoutes = require('./routes/busquedaGeneralRoutes');
var uploadRoutes = require('./routes/uploadRoutes');
var mostrarImagenesRoutes = require('./routes/mostrarImagenesRoutes');
var solicitudesRoutes = require('./routes/solicitudesRoutes');
var itemSolicitudesRoutes = require('./routes/itemSolicitudesRoutes');

var bodyParser = require('body-parser');

//inicialziar variables
var app = express();

//CORS PARA LAS CABECERAS DE LOS DATOS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
  
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
app.use('/', UsuarioRoutes);
app.use('/', hospitalesRoutes);
app.use('/', medicosRoutes);
app.use('/busqueda', busquedaGeneralRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', mostrarImagenesRoutes);
app.use('/item', itemSolicitudesRoutes);
app.use('/solicitud', solicitudesRoutes);
app.use('/', appRoutes);

//escuchar peticiones
app.listen(3000, ()=>{
    console.log("express server corriendo en pueto 3000 online");
});