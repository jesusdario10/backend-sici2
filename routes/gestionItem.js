var express = require('express');
var Solicitud = require('../models/solicitud');
//var mdAutenticacion = require('../middlewares/autenticacion');
//inicialziar variables
var app = express();

app.get('/:id',  (req, res, next)=>{
    var idSolicitud = req.params.id
    var posItem = parseInt( req.query.item);
    console.log(idSolicitud);
    console.log(posItem);

    Solicitud.find({_id:idSolicitud})
        .exec((err, solicitud)=>{
            if(err){
                res.status(500).json({
                  ok:false,
                  mensaje:"no se pudieron traer los datos",
                  errors:err
               });
            } 
           
           solicitud[0].item.splice(posItem, 1)
            
           solicitud.save((err, itemsActualizados)=>{
            if(err){
                res.status(400).json({
                  ok:false,
                  mensaje:"Error al borrar el item",
                  errors:err
               });
              }
           })
           if(itemsActualizados){
            res.status(201).send({
                itemsActualizados: itemsActualizados,
              ok:true
            });
          }
            
        })
   
});
//eliminando items
app.delete('/:id',  (req, res, next)=>{
    var idSolicitud = req.params.id
    var posItem = parseInt( req.query.item);
    
    var body = req.body;
  
    Solicitud.findById(idSolicitud, (err, solicitud)=>{
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
          mensaje:"no existe la solicitud"
       });
      }
       //si si existe 
       let valorItemBorrar = solicitud.item[posItem].valor;
       let cantidadItemBorrar = solicitud.item[posItem].cantidad;
       let nuevoValortotalCalculado = valorItemBorrar*cantidadItemBorrar
       console.log(valorItemBorrar);
       console.log(cantidadItemBorrar);
       console.log(nuevoValortotalCalculado);
       solicitud.valorTotal -= nuevoValortotalCalculado
       

      solicitud.item[posItem].remove()
      //si si existe
      solicitud.save( (err, itemsActualizados)=>{
        if(err){
          res.status(400).json({
            ok:false,
            mensaje:"Error al actualizar usuario",
            errors:err
         });
        }
        if(itemsActualizados){
          res.status(201).send({
            items: itemsActualizados,
            ok:true
          });
        }
      });
    });
   
});



module.exports=app;