var express = require('express');
var Solicitud = require('../models/solicitud');
var mdAutenticacion = require('../middlewares/autenticacion');
var moment = require('moment');
//inicialziar variables
var app = express();




//get solicitud( una sola solicitud para añadir items) usando populate a 2 niveles en un array
app.get('/:id', mdAutenticacion.verificarToken, (req, res, next)=>{
    var solicitud = req.params.id;
    var valor_total = 0;
    Solicitud.find({_id:solicitud})
        .populate('cliente', 'nombre nit direccion telefono')
        .populate({
            path  : 'item.tipovalvula',
            model : 'TipoValvula',
        })
        .exec((err, solicitud)=>{
            if(err){
                res.status(500).json({
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
        })
  });
 

  //get solicitudes mostrar todas para administrador
app.get('/', mdAutenticacion.verificarToken, (req, res, next)=>{
    var valor_total = 0;
    Solicitud.find()
     .populate('cliente', 'nombre')
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
          //total:conteo
       });
      });
    });
  });

  //GET MOSTRAR TODAS LAS SOLICITUDES CREADAS O CERRADAS PARA ACEPTACION O RECHAZO
  app.get('/creadasoCerradas/solicitudes', mdAutenticacion.verificarToken, (req, res, next)=>{
    var valor_total = 0;
    Solicitud.find({$and:[{$or:[{estado:'CREADA'},{estado:'CERRADA'}]}]})
    .populate('cliente', 'nombre')
    .exec((err, solicitudes)=>{
        if(err){
            res.status(500).json({
              ok:false,
              mensaje:"no se pudieron traer los datos",
              errors:err
           });
        }
        res.status(200).json({
          ok:true,
          mensaje:"peticion realizada correctamente",
          solicitudes:solicitudes,
          //total:conteo
            
        });
    })
  })

//GET MOSTRAR TODAS LAS SOLICITUDES EN EJECUCION O DETENIDAS
app.get('/aceptadas/solicitudes', mdAutenticacion.verificarToken, (req, res, next)=>{
    var valor_total = 0;
    Solicitud.find({$and:[{$or:[{estado:'EJECUCION'},{estado:'DETENIDA'}, {estado:'ACEPTADA'}]}]})
     
     .populate('cliente', 'nombre')
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
          //total:conteo
       });
      });
    });
  });  
  //getsolicitudes para los clientes
  app.get('/solicitudesclientes/:cliente', mdAutenticacion.verificarToken, (req, res, next)=>{
    var valor_total = 0;
    var cliente = req.params.cliente
    
    Solicitud.find({cliente:cliente})
     .populate('cliente', 'nombre nit direccion telefono')
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
//consultar solicitudes por fecha para el administrador
app.post('/solicitudesfecha', (req, res, next)=>{
    var body = req.body
    console.log("esto es el body: ", body); 
    var capturaFechaInicial = body.fechaInicial;
    var fechaInicial;
    var capturaFechaFinal = body.fechaFinal;
    var fechaFinal;


    
    console.log("fecha inicial: 149 ", capturaFechaInicial);
    console.log("fecha fechafinal: 150 ", capturaFechaFinal);
 
    //==============SI EL USUARIO NO SELECCIONA NINGUNA FECHA================//
    if(body.fechaInicial == '' && body.fechaFinal == '' || capturaFechaInicial == undefined && capturaFechaFinal == undefined   ){
        console.log("ambos vacios");
        fechaInicial = new Date('2018-01-01');
        fechaFinal = new Date('2080-01-01');
        console.log("1");
    }
    //==========SI EL USUARIO ENVIA TANTO LA FECHA INICIAL COMO LA FINAL ====//
    if(capturaFechaInicial !== undefined && capturaFechaFinal !== undefined || body.fechaInicial !== '' && body.fechaFinal !== '' ){
        fechaInicial = new Date(body.fechaInicial);
        fechaFinal = new Date(body.fechaFinal);
        console.log("2");
    }
    //=================SI ELVIA SOLO LA FECHA FINAL========================//
    if(capturaFechaInicial == undefined && capturaFechaFinal !== undefined || body.fechaInicial == '' && body.fechaFinal !== '' ){
        fechaInicial = new Date('2018-01-01');
        fechaFinal = new Date(body.fechaFinal);
        console.log("3");
    }
    //=================SI ELVIA SOLO LA FECHA INICIAL========================//
    if(capturaFechaInicial !== undefined && capturaFechaFinal == undefined || body.fechaInicial !== '' && body.fechaFinal == '' ){
       fechaInicial = new Date(body.fechaInicial);
       fechaFinal = new Date('2080-01-01');
       console.log("4");
    }

    Solicitud.find({"$and": [{"date":{"$gte":fechaInicial}},{"date":{"$lte":fechaFinal}}]})
        .populate('cliente', 'nombre')
        .exec((err, solicitudes)=>{
            if(err){
                res.status(500).json({
                    ok:false,
                    mensaje:"no se pudieron traer los datos",
                    errors:err
                 });  
            }
            Solicitud.count({"$and": [{"date":{"$gte":fechaInicial}},{"date":{"$lte":fechaFinal}}]})
                .exec((err, conteo)=>{
                    res.status(200).json({
                        ok:true,
                        solicitudes : solicitudes,
                        cantidad : conteo
                    });
                })
 
        });
})


    //post  crear solicitud
    app.post('/', mdAutenticacion.verificarToken, (req, res, next)=>{
        var body = req.body;
        console.log("aqui viene la fecha formateada");
        /*var fecha = moment().format('YYYY-MM-DD hh:mm:ss a');
        console.log(fecha);*/
        var date = new Date();
        var fecha = moment(date).format('YYYY-MM-DD hh:mm:ss a');
        console.log(fecha);

        var solicitud = new Solicitud({
          nombre : body.nombre,
          cliente : body.cliente,
          cargo : body.cargo,
          valorTotal : body.valorTotal
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
    //post para insertar items en las solicitudes
    app.post('/:id/:cliente', mdAutenticacion.verificarToken, (req, res)=>{
        var id = req.params.id;
        var body = req.body;
        console.log(body);
        
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
        
        
        body.item.fechaRequerida = new Date(body.item.fechaRequerida);
        
        //si si existe 
        solicitud.item.push(body.item);
        if(solicitud.valorTotal == 0 || solicitud.valorTotal =='' || solicitud.valorTotal == undefined){
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
    //actualizar estado de una solicitud
    app.put('/:id', mdAutenticacion.verificarToken, (req, res)=>{
        var id = req.params.id;
        var body = req.body;
        console.log(body);
        Solicitud.findById(id, (err, solicitud)=>{
            if(err){
                res.status(400).json({
                    ok:false,
                    mensaje:"no se pudo acceder a la base de datos",
                    solicitud:solicitud
                })
            }
            if(!solicitud){
                res.status(500).json({
                    ok:false,
                    mensaje:"no se encontro la solicitud en la db",
                    err:err
                })
            }
            /*EL TIEMPO EN QUE SE ENTREGUE LA SOLICITUD LO DETERMINARAN LAS HORAS HOMBRE DE CADA TAREA O ACTIVIDAD*/

            
            solicitud.estado = body.estado;

            solicitud.save( (err, solicitudActualizada)=>{
                if(err){
                    res.status(400).json({
                        ok:false,
                        mensaje:"Error al actualizar solicitud",
                        errors:err
                    });
                }
            
                if(solicitudActualizada){
                    res.status(201).send({
                        solicitud: solicitudActualizada,
                        ok:true
                    });
                }
            });

        })
    })
    //delete solicitud
    app.delete('/:id', mdAutenticacion.verificarToken, (req, res)=>{
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
    app.post('/solicitud/:id/', mdAutenticacion.verificarToken, (req, res)=>{
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