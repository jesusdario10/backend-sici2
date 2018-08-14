var express = require('express');
var Solicitud = require('../models/solicitud');
//var mdAutenticacion = require('../middlewares/autenticacion');
//inicialziar variables
var app = express();




//get solicitudes
app.get('/', (req, res, next)=>{
    Solicitud.find({})
     .exec((err, solicitudes)=>{
      if(err){
        res.status(500).json({
          ok:false,
          mensaje:"no se pudieron traer los datos",
          errors:err
       });
      }
      Solicitud.count({}, (err, conteo)=>{
        res.status(200).json({
          ok:true,
          mensaje:"peticion realizada correctamente",
          solicitudes:solicitudes,
          total:conteo
       });
      });
    });
  });
    //post  crear solicitud
    app.post('/',  (req, res, next)=>{
        var body = req.body
        var solicitud = new Solicitud({
          numero : body.numero,
          medico : body.medico,
          item:[{
              campo1 : body.campo1,
              campo2 : body.campo2
          }]
        });
        solicitud.save((err, solicitudGuardada)=>{
          if(err){
              res.status(400).json({
              ok:false,
              mensaje:"no se pudieron traer los datos",
              errors:err
          });
          }
          res.status(201).send({
              solicitudGuardada :solicitudGuardada,
              usuarioToken: req.usuario,
              ok:true
          });
        });
    });
    //put actualizar solicitudes
    app.put('/:id',  (req, res)=>{
        var id = req.params.id;
        var body = req.body;
    
        Solicitud.findById(id, (err, solicitud)=>{
        if(err){
            res.status(500).json({
            ok:false,
            mensaje:"no se pudieron traer los datos",
            errors:err
          });
        }
        if(!solicitud){
            res.status(400).json({
            ok:false,
            mensaje:"no existe el usuario",
          });
        }
        //si si existe
        solicitud.numero = body.numero;
        var campo1 = body.campo1;
        var campo2 = body.campo2;
        solicitud.medico = body.medico;
        console.log(solicitud.medico);
        
        var item = {
            "campo1":campo1,
            "campo2":campo2
        }
        

        solicitud.item.push(item);
        
        solicitud.save( (err, solicitudActualizado)=>{
            if(err){
                res.status(400).json({
                    ok:false,
                    mensaje:"Error al actualizar solicitud",
                    errors:err
                });
            }
        
            if(solicitudActualizado){
                res.status(201).send({
                    solicitud: solicitudActualizado,
                    ok:true
                });
            }
        });
      });
    });
    //delete usuario
    app.delete('/solicitud/:id',  (req, res)=>{
        var id = req.params.id;
    
        Solicitud.findByIdAndRemove(id, (err, solicitudBorrada)=>{
        if(err){
            res.status(400).json({
            ok:false,
            mensaje:"no se pudo borrar solicitud",
            errors:err
        });
        }
        res.status(200).json({
            ok:true,
            mensaje:"peticion realizada correctamente",
            solicitud:solicitudBorrada
        });
      });
    });

module.exports=app;