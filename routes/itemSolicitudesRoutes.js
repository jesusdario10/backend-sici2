var express = require('express');
var Item = require('../models/items_solicitud');
//var mdAutenticacion = require('../middlewares/autenticacion');
//inicialziar variables
var app = express();



//get items
app.get('/', (req, res, next)=>{
    
    Item.find({})
     .populate('nosolicitud', 'numero')
     .exec((err, items)=>{
      if(err){
        res.status(500).json({
          ok:false,
          mensaje:"no se pudieron traer los datos",
          errors:err
       });
      }
      Item.count({}, (err, conteo)=>{
        res.status(200).json({
          ok:true,
          mensaje:"peticion realizada correctamente",
          items:items,
          total:conteo
       });
      });
    });
  });
  //obtener el o los items de una solicitud
  //get usuarios
app.get('/:id', (req, res, next)=>{
    var solicitud = req.params.id
    var sumatoria = 0;
    Item.find({solicitud:solicitud})
     
     .exec((err, items)=>{
      if(err){
        res.status(500).json({
          ok:false,
          mensaje:"no se pudieron traer los datos",
          errors:err
       });
      }
      for(let i=0; i<=items.length; i++){
          sumatoria+=parseInt(items.cantidad)
          
      }
      console.log(sumatoria);
        res.status(200).json({
          ok:true,
          mensaje:"peticion realizada correctamente",
          items:items,
          sumatoria:sumatoria
          
       });
     
    });
  });

    //post  crear item
    app.post('/:id',  (req, res, next)=>{
        var id_solicitud = req.params.id;
        var body = req.body;
        var solicitud = req.params.id
        var item = new Item({
          
          tipovalvula : body.tipovalvula,
          tiposello : body.tiposello,
          diametro : body.diametro,
          rating : body.rating,
          material : body.material,
          otrosdatos : body.otrosdatos,
          tipomtto : body.tipomtto,
          prioridad : body.prioridad,
          dificultad : body.dificultad,
          sitio : body.sitio,
          cantidad : body.cantidad,
          solicitud : solicitud

          
          
        });
        
        item.save((err, itemGuardado)=>{
          if(err){
              res.status(400).json({
              ok:false,
              mensaje:"no se pudieron traer los datos",
              errors:err
          });
          }
          res.status(201).send({
              itemGuardado :itemGuardado,
              usuarioToken: req.usuario,
              ok:true
          });
        });
    });
    //put actualizar usuarios
    app.put('/:id',  (req, res)=>{
        var id = req.params.id;
        var body = req.body;
    
        Item.findById(id, (err, item)=>{
        if(err){
            res.status(500).json({
            ok:false,
            mensaje:"no se pudieron traer los datos",
            errors:err
          });
        }
        if(!item){
            res.status(400).json({
            ok:false,
            mensaje:"no existe el usuario",
          });
        }
        //si si existe
        item.tipovalvula = body.tipovalvula,
        item.nosolicitud = body.nosolicitud,
        item.tiposello = body.tiposello,
        item.diametro = body.diametro,
        item.rating = body.rating,
        item.material = body.material,
        item.otrosdatos = body.otrosdatos,
        item.tipomtto = body.tipomtto,
        item.prioridad = body.prioridad,
        item.dificultad = body.dificultad,
        item.sitio = body.sitio,
        item.cantidad = body.cantidad
    
        item.save( (err, itemActualizado)=>{
            if(err){
                res.status(400).json({
                    ok:false,
                    mensaje:"Error al actualizar item",
                    errors:err
                });
            }
        
            if(itemActualizado){
                res.status(201).send({
                    item: itemActualizado,
                    ok:true
                });
            }
        });
      });
    });
    //delete usuario
    app.delete('/:id',  (req, res)=>{
        var id = req.params.id;
    
        Item.findByIdAndRemove(id, (err, itemBorrado)=>{
        if(err){
            res.status(400).json({
            ok:false,
            mensaje:"no se pudo borrar item",
            errors:err
        });
        }
        res.status(200).json({
            ok:true,
            mensaje:"peticion realizada correctamente",
            item:itemBorrado
        });
      });
    });

module.exports=app;