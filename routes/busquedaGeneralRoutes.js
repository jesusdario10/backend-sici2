var express = require('express');
var Hospital = require('../models/hospitalesModels');
var Medicos = require('../models/medicosModels');
var Usuarios = require('../models/usuarioModel');

var app = express();

// ================================================
// Busqueda general
// ================================================
app.get('/todo/:busqueda', (req, res, next)=>{
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ])  
     .then(respuestas=>{
       res.status(200).json({
         ok:true,
         hospitales: respuestas[0],
         medicos:respuestas[1],
         usuarios:respuestas[2]
       });
     })
});

// ==================================================
// Busqueda Especifica
// ==================================================

app.get('/:tabla/:busqueda', (req, res)=>{
  var tabla = req.params.tabla;
  console.log(tabla);
  var busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, 'i');
  var promesa;

  switch(tabla){
    case 'usuarios':
        promesa = buscarUsuarios(busqueda, regex);
        break;
    case 'medicos':
        promesa = buscarMedicos(busqueda, regex);
        break;  
    case 'hospitales':
        promesa = buscarHospitales(busqueda, regex);
        break; 
    //en caso de que no se ingrese ninguno de los anteriores
    default:
        return  res.status(400).json({
                  ok:false,
                  mensaje: "solo ingrese usuarios, medicos y hospitales",
                  error:{ message: 'Tipo de tabla no valido'}
               });            
  }
  promesa.then(data=>{
    res.status(200).json({
      ok:true,
      [tabla]:data
   }); 
  });
});


function buscarHospitales(busqueda, regex){
  return new Promise((resolve, reject)=>{
    Hospital.find({nombre: regex})
      .populate('usuario', 'nombre email')
      .exec((err, hospitales)=>{
      if(err){
        reject('error al cargar Hospitales ', err);
      }else{
        resolve(hospitales);
      }
    });
  });
}
function buscarMedicos(busqueda, regex){
  return new Promise((resolve, reject)=>{
    Medicos.find({nombre: regex})
      .populate('hospital', 'nombre')
      .populate('usuario','nombre')
      .exec((err, medicos)=>{
      if(err){
        reject('error al cargar Medicos ', err);
      }else{
        resolve(medicos);
      }
    });
  });
}
function buscarUsuarios(busqueda, regex){
  return new Promise((resolve, reject)=>{
    Usuarios.find({},'nombre correo role')
      .or([{'nombre':regex}, {'email':regex}])
      .exec((err, usuarios)=>{
        if(err){
          reject('Error al cargar usuarios '+ err);
        }else{
          resolve(usuarios);
        }
      });
  });
}
module.exports = app;