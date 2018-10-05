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
//SABER SI TODOS LOS MANTENIMIENTOS DE UNA SOLICITUD ESTAN EN ESTADO COMPLETADO
app.get('/completos/:id', (req, res, next)=>{
  var idsolicitud = req.params.id;
  console.log(idsolicitud);
  var elcompleto;

  Mantenimiento.find({solicitud:idsolicitud})
    .exec((err, mantenimientos)=>{
      if(err){
        res.status(400).json({
          ok:false,
          mensaje:"ha ocurrido un error no se trajeron los datos",
          error : err
        });
      }
      if(!mantenimientos){
        res.status(500).json({
          ok:false,
          mensaje: "no existeee!!",
          error : err
        });
      }
      //recorriendo todos los mantenimientos de una solicitud
      var contadordeCompletos = 0;
      
      for(var o = 0 ; o < mantenimientos.length ; o++){
        if(mantenimientos[o].estado == "COMPLETADO"){
          // sumando 1 a una var si esta completo
          contadordeCompletos ++
          console.log(contadordeCompletos);
        }
      }
      
      
      if(contadordeCompletos == mantenimientos.length){
        console.log("estan completos");
        elcompleto = true;
      }else{
        elcompleto = false;
      }
      
      res.status(200).json({
        ok:true,
        completo : elcompleto
      });
    });
});




//CREAR LOS MANTENIMIENTOS
app.post('/:id',    (req, res, next)=>{
    var solicitud = req.params.id;
    var valor_total = 0;
    var body = req.body;
    var fechaini = new Date();
    console.log(fechaini);
    
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
      for(i=0;i<solicitud[0].item.length; i++){

        for(j=0;j<solicitud[0].item[i].cantidad; j++){
          var mantenimiento = new Mantenimiento({
              serie:"",
              solicitud :solicitud[0]._id,
              tipovalvula :solicitud[0].item[i].tipovalvula,
              tiposello : solicitud[0].item[i].tiposello,
              diametro : solicitud[0].item[i].diametro,
              rating : solicitud[0].item[i].rating,
              material : solicitud[0].item[i].material,
              otrosdatos : solicitud[0].item[i].otrosdatos,
              tipomtto : solicitud[0].item[i].tipomtto,
              prioridad : solicitud[0].item[i].prioridad,
              dificultad : solicitud[0].item[i].dificultad,
              sitio : solicitud[0].item[i].sitio,
              valor : solicitud[0].item[i].valor,
              tareas : solicitud[0].item[i].tareas,
              estado : 'INICIAL',
              fechaInicio : fechaini
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

  Mantenimiento.findById(id)
  .exec((err, mantenimientos)=>{
    if(err){
      res.status(400).json({
        ok:false,
        error:err
      });
    }
    mantenimientos.serie = body.serie;
    
    mantenimientos.save((err, datosActualizados)=>{
      if(err){
        res.status(400).json({
          ok:false,
          error:err
        });
      }
      res.status(200).json({
        ok:true,
        mttoActualizado:datosActualizados
      });
    });
  });
});
//==========ACTUALIZANDO EL ESTADO DE LAS ACTIVIDADES==============//
app.put('/manten/estadoactividades/:id', (req, res, next)=>{
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
        mttoActualizado:datosActualizados
      });
    });
  })
});

//==========ACTUALIZANDO LAS OBSERVACIONES DE LOS MANTENIMIENTOS==============//
app.put('/manten/observaciones/:id', (req, res, next)=>{
  var id = req.params.id;
  var body = req.body;
  console.log(body);

  Mantenimiento.findById(id, (err, observacionesGuardadas)=>{
    if(err){
      res.status(200).json({
        ok:false,
        mensaje :"No se pudo acceder a los datos",
        error : err
      });
    }
    if(!observacionesGuardadas){
      res.status(500).json({
        ok:false,
        mensaje : "no existen los datos"
      });
    }
    
    observacionesGuardadas.obsTipovalvula = body.obsTipovalvula;
    observacionesGuardadas.obsCuerpo = body.obsCuerpo;
    observacionesGuardadas.obsComponentes = body.obsComponentes;
    observacionesGuardadas.obsTmttoPrioUbi = body.obsTmttoPrioUbi;
    observacionesGuardadas.obsDificultad = body.obsDificultad;
    
    observacionesGuardadas.save((err, obsActualizadas)=>{
      if(err){
        res.status(200).json({
          ok:false,
          mensaje :"No se pudo acceder a los datos",
          error : err
        });
      }
      if(!obsActualizadas){
        res.status(500).json({
          ok:false,
          mensaje : "no existen los datos"
        });
      }
      res.status(200).json({
        ok:true,
        mttoActualizado:obsActualizadas
      });
    });
  });
});
//==================ACTUALIZANDO EL ESTADO DEL MANTENIMIENTO==========================//
app.put('/manten/estado/:id', (req, res, next)=>{
  var id = req.params.id;
  var body = req.body;
 
  var fechaActual = new Date();

  Mantenimiento.findById(id, (err, mantenimiento)=>{
    if(err){
      res.status(200).json({
        ok:false,
        mensaje :"No se pudo acceder a los datos",
        error : err
      });
    }
    if(!mantenimiento){
      res.status(500).json({
        ok:false,
        mensaje : "no existen los datos"
      });
    }
    if(body.estado=="DETENIDO"){
      mantenimiento.estado = body.estado;
      mantenimiento.obsEstado = body.obsEstado;
      mantenimiento.fechaDetenido = fechaActual;
    }
    
    
    if(body.estado=="COMPLETADO"){
      mantenimiento.estado = body.estado;
      mantenimiento.obsEstado = body.obsEstado;
      mantenimiento.fechaFin = fechaActual;
    }
    if(body.estado=="EJECUCION"){
      mantenimiento.estado = body.estado;
    }
    
    mantenimiento.save((err, estadoActualizado)=>{
      if(err){
        res.status(200).json({
          ok:false,
          mensaje :"No se pudo acceder a los datos",
          error : err
        });
      }
      if(!estadoActualizado){
        res.status(500).json({
          ok:false,
          mensaje : "no existen los datos"
        });
      }
      res.status(200).json({
        ok:true,
        mttoActualizado:estadoActualizado
      });
    });
  });
});



module.exports=app;