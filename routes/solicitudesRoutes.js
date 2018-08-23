var express = require('express');
var Solicitud = require('../models/solicitud');
//var mdAutenticacion = require('../middlewares/autenticacion');
//inicialziar variables
var app = express();




//get solicitud para añadir items
app.get('/:id', (req, res, next)=>{
   var solicitud = req.params.id;
    var valor_total = 0;
    

    Solicitud.find({_id:solicitud})
     .exec((err, solicitudes)=>{
      if(err){
        res.status(500).json({
          ok:false,
          mensaje:"no se pudieron traer los datos",
          errors:err
       });
      }
      /*for (let index = 0; index < solicitudes.length; index ++) {

        for (let index2 = 0; index2 < solicitudes[index].item.length; index2 ++) {
            valor_total= valor_total + solicitudes[index].item[index2].valor;   
          }
        
      }*/
      console.log("que viene por aqui");
      console.log(solicitudes[0].valorTotal);
      valor_total = solicitudes[0].valorTotal

      Solicitud.count({}, (err, conteo)=>{
        res.status(200).json({
          ok:true,
          mensaje:"peticion realizada correctamente",
          solicitudes:solicitudes,
          total:conteo,
          valorTotal:valor_total,
          valorTotal2:valor_total
       });
      });
    });
  });
  //get solicitudes mostrar todas
app.get('/', (req, res, next)=>{
    var valor_total = 0;

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
        var body = req.body;

        
        var solicitud = new Solicitud({
          nombre : body.nombre
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
    app.post('/:id',  (req, res)=>{
        var id = req.params.id;
        var body = req.body;
        console.log(body);
        console.log("lo que biene en valor total $$$$$$$$$$$$$$$$$$$");
        console.log(body.valorTotal);
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
        solicitud.item.push(body.item);
        if(solicitud.valorTotal==0 || solicitud.valorTotal=='' || solicitud.valorTotal ==undefined){
            solicitud.valorTotal=body.valorTotal;
        }else{
            solicitud.valorTotal =solicitud.valorTotal+ body.valorTotal;
        }
        
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
    //delete solicitud
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
    //delete item de la solicitud
    app.post('/solicitud/:id/',  (req, res)=>{
        var id = req.params.id;
        var doc =  parent.children.id(_id);
    
        Solicitud.findById(id, (err, solicitud)=>{
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