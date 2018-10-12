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
    //console.log(fechaini);
    
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
      solicitud[0].fechaInicial = fechaini;
      
     
      
       solicitud[0].save((err, guardada)=>{
        if(err){
          res.status(500).json({
            ok:false,
            mensaje:"no se pudieron traer los datos",
            errors:err
         });         
        }
      });

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
              estado : 'EJECUCION',
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
      mantenimiento.estadoAnterior = mantenimiento.estado;
      mantenimiento.estado = body.estado;
      mantenimiento.obsEstado = body.obsEstado;
      mantenimiento.fechaDetenido = fechaActual;
    }
    
    
    if(body.estado=="COMPLETADO"){
      mantenimiento.estadoAnterior = mantenimiento.estado;
      mantenimiento.estado = body.estado;
      mantenimiento.obsEstado = body.obsEstado;
      mantenimiento.fechaFin = fechaActual;
    }
    if(body.estado=="EJECUCION"){
      mantenimiento.estadoAnterior = mantenimiento.estado;
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
//MOSTRAR MANTENIMIENTOS ENTRE FECHAS
app.post('/manten/entre/fechas', (req, res, next)=>{
  var body = req.body;
  var capturaFechaInicial = new Date(body.fechaInicial);
  var capturaFechaFinal =  new Date(body.fechaFinal);
  console.log(capturaFechaFinal);


  /*
    1-milIni        = convirtiendo a minisegundos la fecha inicial
    2-milFin        = convirtiendo a milisegundos la fecha final
    3-diferencia    = restando las fechas para saber la diferencia en dias
    4-dia           = este valor equivale a un dia en milisegundos(1000*60*60*24) 
    5-dia2          = variable incrementadora de dias en milisegundos que usaremos en el for
    6-fecha         = contendra la fecha que se ira generando en el for
    7-numerodias    = division entre la diferencia y los dias todo esto se hace en milisegundos
                      para QUE nos de un numero entero que usaremos en el for como limite de iteraciones
    8-arrayfechas   = contendra las fechas que se generaron en el for                  
  */
  var milIni = capturaFechaInicial.getTime();
  var milFin = capturaFechaFinal.getTime();
  var diferencia = milFin - milIni;
  const dia = 86400000;
  var dia2 = dia
  var fecha;
  var numeroDias = diferencia/dia;
  var ejecucion = 0;
  var detenidos = 0;
  var completos = 0;
  var arrayfechas = [];
  var arrayEjecucion = [];
  var arrayDetenidos = [];
  var arrayCompletos = [];
  


  Mantenimiento.find({"$and": [{"fechaInicio":{"$gte":capturaFechaInicial}},{"fechaInicio":{"$lte":capturaFechaFinal}}]})
    .exec((err, mantenimientos)=>{
    

      for(var i = 0 ; i<= numeroDias; i++){
        fecha = moment(new Date(milIni+dia2)).format('YYYY-MM-DD');
        dia2 = dia + dia2;
        arrayfechas.push(fecha); 
        
        for(var y =0; y< mantenimientos.length; y++){
          let = fechaInicioMantenimiento = moment(new Date(mantenimientos[y].fechaInicio)).format('YYYY-MM-DD');
          let = fechaCompletadoelMantenimiento = moment(new Date(mantenimientos[y].fechaFin)).format('YYYY-MM-DD');
          let = fechaDetenidoelMantenimiento = moment(new Date(mantenimientos[y].fechaDetenido)).format('YYYY-MM-DD');

          if( fecha == fechaInicioMantenimiento){
            ejecucion = ejecucion + 1; 
          }
          if( fecha == fechaDetenidoelMantenimiento){
            detenidos = detenidos + 1; 
            ejecucion = ejecucion - 1; 

          }
          
          //-----------------------------------------------------------------
          if( fecha == fechaCompletadoelMantenimiento && mantenimientos[y].estado == 'COMPLETADO'){
            completos = completos + 1; 
            if(mantenimientos[y].estadoAnterior =='DETENIDO'){
              
              detenidos = detenidos - 1; 
            }
            if(mantenimientos[y].estadoAnterior =='EJECUCION'){
              ejecucion = ejecucion - 1;
            }
          }
          if(ejecucion < 0){
            ejecucion = 0;
          }
        }
        arrayEjecucion[i]= ejecucion;
        arrayDetenidos[i]= detenidos;
        arrayCompletos[i]= completos;


      }

      console.log(arrayEjecucion);
      Mantenimiento.count({"$and": [{"fechaInicio":{"$gte":capturaFechaInicial}},{"fechaInicio":{"$lte":capturaFechaFinal}}]}, (err, conteo)=>{
        res.status(200).json({
          ok:true,
          fechas : arrayfechas,
          result: mantenimientos,
          ejecucion:arrayEjecucion,
          detenidos :arrayDetenidos,
          completos : arrayCompletos,
          contMantenimientos : conteo

       });
      });
    })
})



module.exports=app;