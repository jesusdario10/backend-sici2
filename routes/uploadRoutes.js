var express = require('express');
var Usuario = require('../models/usuarioModel');
var Medico = require('../models/medicosModels');
var Hospital = require('../models/hospitalesModels');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();
// default options
app.use(fileUpload());
app.post('/:tipo/:id', (req, res, next)=>{
  var tipo = req.params.tipo;
  var id = req.params.id;
  if (!req.files) return res.status(400).json({message:"No files were uploaded."});
  //tipo valido par ingresar la ccoleccion donde se guardara la imagen
  var tiposValidos =["hospitales", "medicos", "usuarios"];

  if(tiposValidos.indexOf(tipo)<0){
    return res.status(400).json({
      message:"extension no valida",
      errors:{ message:"debe ser hospitales, medicos, usuarios"}
    });
  }
  //obtener nombre del archivo
  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split('.');
  let extension = nombreCortado[nombreCortado.length -1]
  //validasion para las extensiones validas
  var extensionesValidas = ['png', 'jpg', 'git', 'jpeg'];
  // si es -1 es que no encontro en el array de extenciones validas
  if(extensionesValidas.indexOf(extension) < 0){ 
    return res.status(400).json({
      message:"extension no valida",
      errors:{ message:"debe ser png, jpg, jpeg"}
    });
  }
  //nombre archivo personalizado sera id_usuario_+numerorandom.extension del archivo
  var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;
  //mover el archivo
  var path = `./uploads/${tipo}/${nombreArchivo}`;

  archivo.mv( path, err=>{
    if(err){
      return res.status(500).json({
        message:"error al mover archivo",
        errors:err
      });
    }
    subirDatosdeImagenporTipo(tipo, id, nombreArchivo, res);
    //return res.status(200).json({
    //  message:'archivo movido',
    //  nombreCortado:nombreCortado
    //});
  });
});

function subirDatosdeImagenporTipo(tipo, id, nombreArchivo, res){
  if(tipo==='usuarios'){
      
    Usuario.findById(id, (err, usuario)=>{
      if(!usuario){
        return res.status(500).json({
            message:"no existe el usuario en la db",
            errors:{message:'Usuario no existe'}
          });  
      }
      if(err){
        return res.status(400).json({
          message:"error al accesar a la db",
          errors:err
        });  
      }

      // ====en caso de que ya tubiera una imagen la borramos ===== //
      var pathViejo = "./uploads/usuarios/"+usuario.img;
      if(fs.existsSync(pathViejo)){
        fs.unlink(pathViejo)//con unlink borramos
      }
      // =========================================================== //
      // *******Almacenamos el nombre del archivo en la db********** //
      usuario.img = nombreArchivo;
      // =========Actualziamos el usuario ========================== //
      usuario.save((err, usuarioActualizado)=>{
        if(err){
          return res.status(400).json({
            message:"error al accesar a la db",
            errors:err
          });  
        }
        return res.status(200).json({
          message:"Usuario Actualizado",
          usuario:usuarioActualizado
        });  
      });
    });
  }
  if(tipo==='medicos'){
    Medico.findById(id, (err, medico)=>{
      if(!medico){
        return res.status(500).json({
            message:"no existe el medico en la db",
            errors:{message:'Medico no existe'}
          });  
      }
      if(err){
        return res.status(400).json({
          message:"error al accesar a la db",
          errors:err
        });  
      }

      // ====en caso de que ya tubiera una imagen la borramos ===== //
      var pathViejo = "./uploads/medicos/"+medico.img;
      if(fs.existsSync(pathViejo)){
        fs.unlink(pathViejo)//con unlink borramos
      }
      // =========================================================== //
      // *******Almacenamos el nombre del archivo en la db********** //
      medico.img = nombreArchivo;
      // =========Actualziamos el medico ========================== //
      medico.save((err, medicoActualizado)=>{
        if(err){
          return res.status(400).json({
            message:"error al accesar a la db",
            errors:err
          });  
        }
        return res.status(200).json({
          message:"Medico Actualizado",
          medico:medicoActualizado
        });  
      });
    });
  }
  if(tipo==='hospitales'){
    Hospital.findById(id, (err, hospital)=>{
      if(!hospital){
        return res.status(500).json({
            message:"no existe el usuario en la db",
            errors:{message:'hospital no existe'}
          });  
      }
      if(err){
        return res.status(400).json({
          message:"error al accesar a la db",
          errors:err
        });  
      }

      // ====en caso de que ya tubiera una imagen la borramos ===== //
      var pathViejo = "./uploads/hospitales/"+hospital.img;
      if(fs.existsSync(pathViejo)){
        fs.unlink(pathViejo)//con unlink borramos
      }
      // =========================================================== //
      // *******Almacenamos el nombre del archivo en la db********** //
      hospital.img = nombreArchivo;
      // =========Actualziamos el hospital ========================== //
      hospital.save((err, hospitalActualizado)=>{
        if(err){
          return res.status(400).json({
            message:"error al accesar a la db",
            errors:err
          });  
        }
        return res.status(200).json({
          message:"Hospital Actualizado",
          hospital:hospitalActualizado
        });  
      });
    });
  }
}

module.exports = app;
