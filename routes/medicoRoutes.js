var express = require('express');
var Medico = require('../models/medicosModels');
var mdAutenticacion = require('../middlewares/autenticacion');
//inicialziar variables
var app = express();


app.get('/medicoprueba',  (req, res, next)=>{
    res.status(200).json({
        ok:true,
        mensaje:"ruta correcta"
    });
});

//get usuarios
app.get('/medico', (req, res, next)=>{
    var desde = req.query.desde || 0;
    desde =Number(desde);
    Medico.find({})
     .skip(desde)
      
     .populate('usuario', 'nombre correo')
     .populate('hospital')
     .exec((err, medicos)=>{
      if(err){
        res.status(500).json({
          ok:false,
          mensaje:"no se pudieron traer los datos",
          errors:err
       });
      }
      Medico.count({}, (err, conteo)=>{
        res.status(200).json({
          ok:true,
          mensaje:"peticion realizada correctamente",
          medicos:medicos,
          total:conteo
       });
      });
    });
  });
    //post  crear usuario
    app.post('/medico', mdAutenticacion.verificarToken,  (req, res, next)=>{

        var body = req.body
        var medico = new Medico({
          nombre : body.nombre,
          usuario: req.usuario._id,
          hospital: body.hospital//este campo lo recibiremos de la peticion post o put de angular
        });
        
        medico.save((err, medicoGuardado)=>{
          if(err){
              res.status(400).json({
              ok:false,
              mensaje:"no se pudieron traer los datos",
              errors:err
          });
          }
          res.status(201).send({
              medicoGuardado :medicoGuardado,
              usuarioToken: req.usuario,
              ok:true
          });
        });
    });
    //put actualizar usuarios
    app.put('/medico/:id', mdAutenticacion.verificarToken,   (req, res)=>{
        var id = req.params.id;
        var body = req.body;
    
        Medico.findById(id, (err, medico)=>{
        if(err){
            res.status(500).json({
            ok:false,
            mensaje:"no se pudieron traer los datos",
            errors:err
          });
        }
        if(!medico){
            res.status(400).json({
            ok:false,
            mensaje:"no existe el usuario",
          });
        }
        //si si existe
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;//este campo lo recibiremos de la peticion post o put de angular
    
        medico.save( (err, medicoActualizado)=>{
            if(err){
                res.status(400).json({
                    ok:false,
                    mensaje:"Error al actualizar medico",
                    errors:err
                });
            }
        
            if(medicoActualizado){
                res.status(201).send({
                    medico: medicoActualizado,
                    ok:true
                });
            }
        });
      });
    });
    //delete usuario
    app.delete('/medico/:id', mdAutenticacion.verificarToken,  (req, res)=>{
        var id = req.params.id;
    
        Medico.findByIdAndRemove(id, (err, medicoBorrado)=>{
        if(err){
            res.status(400).json({
            ok:false,
            mensaje:"no se pudo borrar medico",
            errors:err
        });
        }
        res.status(200).json({
            ok:true,
            mensaje:"peticion realizada correctamente",
            medico:medicoBorrado
        });
      });
    });

module.exports=app;