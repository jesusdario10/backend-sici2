var express = require('express');
var app = express();
var  OrdenModel = require('../models/ordenModel');


//Prueba Ordenes
app.get('/', (req, res, next)=>{
  OrdenModel.find()
    .populate('cliente', 'nombre')
    .exec((err, getOrdenes)=>{
      if(err){
        res.status(400).json({
            ok:false,
            mensaje:"no se pudo tener acceso a la db"
        });
      }
      if(!getOrdenes){
        res.status(500).json({
            ok:false,
            mensaje:"no existe la orden"
        });
      }
      res.status(200).json({
        ok:true,
        mensaje:"!Exitoooo¡",
        ordenes :getOrdenes
     });
   });
});
//CrearOrdenes
app.post('/crear', (req, res, next)=>{
    var body = req.body;

    var saveOrden = new OrdenModel({
          solicitud: body.solicitud,
          cliente : body.cliente,
          ejecutado: body.ejecutado,
          cantidad : body.cantidad
    });
    
    saveOrden.save((err, ordenGuardada)=>{
        if(err){
            res.status(400).json({
                ok:false,
                mensaje:"no se pudo tener acceso a la db"
            });
        }
        if(!ordenGuardada){
            res.status(500).json({
                ok:false,
                mensaje:"no llego ninguna orden para guardar"
            });
        }
        res.status(200).json({
            ok:true,
            mensaje:"!exito",
            ordenGuardada:ordenGuardada
        });
    });
       
    

    
})


module.exports = app