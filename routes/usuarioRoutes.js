var express = require('express');
var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuarioModel');
var mdAutenticacion = require('../middlewares/autenticacion');
//inicialziar variables
var app = express();

//rutas

//get usuarios
app.get('/usuarios', (req, res, next)=>{
  var desde = req.query.desde || 0;
  desde=Number(desde);
  Usuario.find({})
   .populate('cliente', 'nombre')
   .populate('cargo', 'nombre')
   .skip(desde)
   .limit(5)
   .exec((err, usuario)=>{
    if(err){
      res.status(500).json({
        ok:false,
        mensaje:"no se pudieron traer los datos",
        errors:err
     });
    }
    Usuario.count({}, (err, conteo)=>{
      res.status(200).json({
        ok:true,
        mensaje:"peticion realizada correctamente",
        usuarios:usuario,
        total:conteo
     });
    })
  });
});


//post  crear usuario
app.post('/usuarios',  (req, res, next)=>{

  var body = req.body
  console.log(body);
  var usuario = new Usuario({
    nombre : body.nombre,
    correo: body.correo,
    password: bcrypt.hashSync(body.password, 10),
    img : body.img,
    role : body.role,
    cargo : body.cargo,
    cliente : body.cliente
    
  });
  
  usuario.save((err, usuarioGuardado)=>{
    if(err){
      res.status(400).json({
        ok:false,
        mensaje:"no se pudieron traer los datos",
        errors:err
     });
    }
    res.status(200).send({
      usuarioGuardado :usuarioGuardado,
      usuarioToken: req.usuario,
      ok:true
    });
  });
});
//put actualizar usuarios
app.put('/usuarios/:id',  (req, res)=>{
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
        mensaje:"no existe el usuario"
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
app.delete('/usuarios/:id', (req, res)=>{
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