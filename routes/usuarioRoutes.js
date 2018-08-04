var express = require('express');
var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuarioModel');
var mdAutenticacion = require('../middlewares/autenticacion');
//inicialziar variables
var app = express();

//rutas

//get usuarios
app.get('/usuarios', (req, res, next)=>{
  Usuario.find({},'nombre email img role')
   .exec((err, usuario)=>{
    if(err){
      res.status(500).json({
        ok:false,
        mensaje:"no se pudieron traer los datos",
        errors:err
     });
    }
    res.status(200).json({
      ok:true,
      mensaje:"peticion realizada correctamente",
      usuarios:usuario
   });
  });
});


//post  crear usuario
app.post('/', mdAutenticacion.verificarToken, (req, res, next)=>{

  var body = req.body
  var usuario = new Usuario({
    nombre : body.nombre,
    correo: body.correo,
    password: bcrypt.hashSync(body.password, 10),
    img : body.img,
    role : body.role
  });
  
  usuario.save((err, usuarioGuardado)=>{
    if(err){
      res.status(400).json({
        ok:false,
        mensaje:"no se pudieron traer los datos",
        errors:err
     });
    }
    res.status(201).send({
      usuarioGuardado :usuarioGuardado,
      usuarioToken: req.usuario,
      ok:true
    });
  });
});
//put actualizar usuarios
app.put('/:id', mdAutenticacion.verificarToken, (req, res)=>{
  var id = req.params.id;
  var body = req.body;

  Usuario.findById(id, (err, usuario)=>{
    if(err){
      res.status(500).json({
        ok:false,
        mensaje:"no se pudieron traer los datos",
        errors:err
     });
    }
    if(!usuario){
      res.status(400).json({
        ok:false,
        mensaje:"no existe el usuario",
     });
    }
    //si si existe
    usuario.nombre = body.nombre;
    usuario.correo = body.correo;
    usuario.role = body.role;

    usuario.save( (err, usuarioActualizado)=>{
      if(err){
        res.status(400).json({
          ok:false,
          mensaje:"Error al actualizar usuario",
          errors:err
       });
      }
      usuarioActualizado.password =':)';
     
      if(usuarioActualizado){
        res.status(201).send({
          usuario: usuarioActualizado,
          ok:true
        });
      }
    });
  });
})
//delete usuario
app.delete('/:id', mdAutenticacion.verificarToken, (req, res)=>{
  var id = req.params.id;

  Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
    if(err){
      res.status(400).json({
        ok:false,
        mensaje:"no se pudo borrar usuario",
        errors:err
     });
    }
    res.status(200).json({
      ok:true,
      mensaje:"peticion realizada correctamente",
      usuarios:usuarioBorrado
   });
  });
});
module.exports=app;