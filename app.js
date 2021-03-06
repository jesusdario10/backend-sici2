var express = require('express');
var mongoose = require('mongoose');
var appRoutes = require('./routes/appRoutes');
var UsuarioRoutes = require('./routes/usuarioRoutes.js');
var cargoRoutes = require('./routes/cargoRoutes');
var clientesRoutes = require('./routes/clienteRoute');
var LoginRoutes = require('./routes/loginRoutes');
var hospitalesRoutes = require('./routes/hospitalesRoutes');
var medicosRoutes = require('./routes/medicoRoutes');
var busquedaGeneralRoutes = require('./routes/busquedaGeneralRoutes');
var uploadRoutes = require('./routes/uploadRoutes');
var mostrarImagenesRoutes = require('./routes/mostrarImagenesRoutes');
var solicitudesRoutes = require('./routes/solicitudesRoutes');
//var itemSolicitudesRoutes = require('./routes/itemSolicitudesRoutes');
var gestionItemRoutes = require('./routes/gestionItem');
//var tareaRoutes = require('./routes/tareaRoutes');
//var tipomttoRoutes = require('./routes/tipomtto');
var tipoValvulaRoutes = require('./routes/tiposValvulasRoutes');
//var ordenRoutes = require('./routes/ordenRoutes');
var mantenimientoRoutes = require('./routes/mantenimientoRoutes');
var informesCliente = require('./routes/informesCliente');

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
//app.use('/item', itemSolicitudesRoutes);
app.use('/gestionitem', gestionItemRoutes);
app.use('/solicitud', solicitudesRoutes);
//app.use('/tarea', tareaRoutes);
//app.use('/tipomtto', tipomttoRoutes);
app.use('/clientes', clientesRoutes);
app.use('/cargos', cargoRoutes);
app.use('/tipovalvula', tipoValvulaRoutes);
//app.use('/ordenes', ordenRoutes);
app.use('/mantenimientos', mantenimientoRoutes);
app.use('/infocliente', informesCliente);


app.use('/', appRoutes);

//escuchar peticiones
app.listen(3000, ()=>{
    console.log("express server corriendo en pueto 3000 online");
});