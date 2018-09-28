var express = require('express');
var Solicitud = require('../models/solicitud');
var Mantenimiento = require('../models/mantenimientoModel');
var mdAutenticacion = require('../middlewares/autenticacion');
var moment = require('moment');
//inicialziar variables
var app = express();

//LISTAR LOS MANTENIMIENTOS DE UNA SOLICITUD / ORDEN
app.get('/:id',  (req, res, next)=>{
  var id = req.params.id;
  Mantenimiento.find({solicitud:id})
  .exec((err, mantenimientos)=>{
    if(err){
      res.status(400).json({
        ok:false,
        mensaje:"no se pudieron traer los datos",
        errors:err
     });
    }
    if(!mantenimientos){
      res.status(500).json({
        ok:false,
        mensaje:"no existe",
        errors:err
     });    
    }
    res.status(200).json({
      ok:true,
      mensaje:"!Exitoo¡",
      mantenimientos: mantenimientos
    });

  });
});
//LISTAR MANTENIMIENTO POR ID ES DECIR LA VALVULA A LA QUE SE LE APLICARA EL MTTO
app.get('/manten/:id2',   (req, res, next)=>{
  var id = req.params.id2;
  
  Mantenimiento.findById(id)
    .populate('tipovalvula', 'nombre')
    .exec((err, mantenimiento)=>{
      if(err){
        res.status(400).json({
          ok:false,
          mensaje:"ha ocurrido un error no se trajeron los datos",
          error : err
        });
      }
      if(!mantenimiento){
        res.status(500).json({
          ok:false,
          mensaje: "no existeee!!",
          error : err
        });
      }
      res.status(200).json({
        ok:true,
        mensaje:"!Exitoo..¡",
        mantenimiento : mantenimiento
      });
   
    })   
});
//CREAR LOS MANTENIMIENTOS
app.post('/:id',    (req, res, next)=>{
    var solicitud = req.params.id;
    var valor_total = 0;
    var body = req.body;
    
    Solicitud.find({_id:solicitud})
     //.populate('cliente', 'nombre nit direccion telefono')
     
     .exec((err, solicitud)=>{
      if(err){
        res.status(400).json({
          ok:false,
          mensaje:"no se pudieron traer los datos",
          errors:err
       });
      }
      res.status(200).json({
          ok:true,
          mensaje: "listado ok",
          solicitud:solicitud[0]
      })
      console.log("aqui viene el length");
      

      for(i=0;i<solicitud[0].item.length; i++){

        for(j=0;j<solicitud[0].item[i].cantidad; j++){
          var mantenimiento = new Mantenimiento({
              serie:"",
              solicitud :solicitud[0]._id,
              tipovalvula :solicitud[0].item[i].tipovalvula,
              tiposello : solicitud[0].item[i].tiposello,
              diametro : solicitud[0].item[i].diametro,
              rating : solicitud[0].item[i].diametro,
              material : solicitud[0].item[i].material,
              otrosdatos : solicitud[0].item[i].otrosdatos,
              tipomtto : solicitud[0].item[i].tipomtto,
              prioridad : solicitud[0].item[i].prioridad,
              dificultad : solicitud[0].item[i].dificultad,
              sitio : solicitud[0].item[i].sitio,
              valor : solicitud[0].item[i].valor,
              tareas : solicitud[0].item[i].tareas
          })
          //console.log(mantenimiento);
          //console.log("+");
          mantenimiento.save((err, mantenimiento)=>{
            if(err){
              res.status(500).json({
                ok:false,
                mensaje:"no se pudieron traer los datos",
                errors:err
             });         
            }
          });
        }//for2       
      }//for1
    });
  });

//ACTUALZIAR EL SERIAL DE LAS VALVULAS VERSION2
app.put('/:id/:index',  (req, res, next)=>{
  var id = req.params.id;
  var index = parseInt(req.params.index);
  var body = req.body;
  console.log(id);
  console.log(index);
  console.log(body.serie);

  Mantenimiento.findById(id)
  .exec((err, mantenimientos)=>{
    if(err){
      res.status(400).json({
        ok:false,
        error:err
      });
    }
    mantenimientos.serie = body.serie;
    console.log(mantenimientos.serie);

    mantenimientos.save((err, datosActualizados)=>{
      if(err){
        res.status(400).json({
          ok:false,
          error:err
        });
      }
      res.status(200).json({
        ok:true,
        respuesta:datosActualizados
      });
    });
  });
});
//==========ACTUALIZANDO EL ESTADO DE LOS MANTENIMIENTOS==============//
app.put('/manten/estado/:id', (req, res, next)=>{
  var id = req.params.id;
  var body = req.body;
  var index = parseInt(req.query.index);
  console.log(typeof index);
  console.log(body);
  

  Mantenimiento.findById(id, (err, respMantenimiento)=>{
        
    if(err){
      res.status(200).json({
        ok:false,
        mensaje :"No se pudo acceder a los datos",
        error : err
      });
    }
    if(!respMantenimiento){
      res.status(500).json({
        ok:false,
        mensaje : "no existen los datos"
      });
    }
    console.log(respMantenimiento.tareas[index]);
    respMantenimiento.tareas[index].estado = body.estado;
    respMantenimiento.tareas[index].tiempo = parseFloat(body.tiempo);
    respMantenimiento.save((err, datosActualizados)=>{
      if(err){
        res.status(400).json({
          ok:false,
          error:err
        });
      }
      res.status(200).json({
        ok:true,
        respuesta:datosActualizados
      });
    });
  })


  
});



module.exports=app;