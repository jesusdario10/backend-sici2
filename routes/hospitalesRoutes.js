var express = require('express');
var bcrypt = require('bcryptjs');
var Hospitales = require('../models/hospitalesModels');
var mdAutenticacion = require('../middlewares/autenticacion');
//inicialziar variables
var app = express();

//get Hospitales
app.get('/hospitales',  (req, res, next)=>{
    var desde = req.query.desde;
    desde = Number(desde);
    Hospitales.find({})
     .skip(desde)
     
     .populate('usuario', 'nombre correo')
     .exec((err, hospitales)=>{
      if(err){
        res.status(500).json({
          ok:false,
          mensaje:"no se pudieron traer los datos",
          errors:err
       });
      }
      Hospitales.count({}, (err, conteo)=>{
        res.status(200).json({
            ok:true,
            mensaje:"peticion realizada correctamente",
            hospitales:hospitales,
            total:conteo
         });
      })

    });
  });
  //get Hospital es decir uno solo
    app.get('/hospital/:id',  (req, res, next)=>{
        var id = req.params.id;
        
        Hospitales.findById(id)
            .populate('usuario', 'nombre img email')
            .exec((err, hospital)=>{
                if(err){
                    res.status(500).json({
                    ok:false,
                    mensaje:"no se pudieron traer los datos",
                    errors:err
                    });
                }
                if(!hospital){
                    res.status(400).json({
                    ok:false,
                    mensaje:"no existe",
                    errors:err
                    });
                }
                res.status(200).json({
                    ok:true,
                    hospital:hospital
                });       

            })

   
    });
    //post  crear usuario
    app.post('/hospitales', mdAutenticacion.verificarToken,  (req, res, next)=>{

        var body = req.body
        var hospital = new Hospitales({
            nombre : body.nombre,
            img : body.imagen,
            usuario: req.usuario._id,  
        });
        console.log(hospital.img);
        
        
        hospital.save((err, hospitalGuardado)=>{
          if(err){
              res.status(400).json({
              ok:false,
              mensaje:"no se pudieron traer los datos",
              errors:err
          });
          }
          res.status(201).send({
              hospitalGuardado :hospitalGuardado,
              usuarioToken: req.usuario,
              ok:true
          });
        });
    });
    //put actualizar usuarios
    app.put('/hospitales/:id', mdAutenticacion.verificarToken, (req, res)=>{
        var id = req.params.id;
        var body = req.body;
    
        Hospitales.findById(id, (err, hospital)=>{
        if(err){
            res.status(500).json({
            ok:false,
            mensaje:"no se pudieron traer los datos",
            errors:err
        });
        }
        if(!hospital){
            res.status(400).json({
            ok:false,
            mensaje:"no existe el usuario",
        });
        }
        //si si existe
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;
        hospital.img = body.img;
    
        hospital.save( (err, hospitalActualizado)=>{
            if(err){
                res.status(400).json({
                    ok:false,
                    mensaje:"Error al actualizar hospital",
                    errors:err
                });
            }
        
            if(hospitalActualizado){
                res.status(201).send({
                    hospital: hospitalActualizado,
                    ok:true
                });
            }
        });
      });
    });
    //delete usuario
    app.delete('/hospitales/:id', mdAutenticacion.verificarToken, (req, res)=>{
        var id = req.params.id;
    
        Hospitales.findByIdAndRemove(id, (err, hospitalBorrado)=>{
        if(err){
            res.status(400).json({
            ok:false,
            mensaje:"no se pudo borrar hospital",
            errors:err
        });
        }
        res.status(200).json({
            ok:true,
            mensaje:"peticion realizada correctamente",
            hospital:hospitalBorrado
        });
      });
    });

module.exports=app;