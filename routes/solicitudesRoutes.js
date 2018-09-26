var express = require('express');
var Solicitud = require('../models/solicitud');
var mdAutenticacion = require('../middlewares/autenticacion');
var moment = require('moment');
//inicialziar variables
var app = express();




//get solicitud( una sola solicitudpara añadir items)
app.get('/:id', mdAutenticacion.verificarToken, (req, res, next)=>{
    var solicitud = req.params.id;
    var valor_total = 0;
    Solicitud.find({_id:solicitud})
     .populate('cliente', 'nombre nit direccion telefono')
     .populate('tipovalvula', 'nombre')
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
    });
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

        console.log(solicitudes[0].date);
        var ele = moment(solicitudes[0].date).format("DD-MM-YYYY")
        console.log(ele);

        for(var i=0; i<solicitudes.length;i++){
            solicitudes[i].date = moment(solicitudes[0].date).format("DD-MM-YYYY")
            
        }

        res.status(200).json({
          ok:true,
          mensaje:"peticion realizada correctamente",
          solicitudes:solicitudes,
          //total:conteo
            
        });
    })
  })

//GET MOSTRAR TODAS LAS SOLICITUDES ACEPTADAS
app.get('/aceptadas/solicitudes', mdAutenticacion.verificarToken, (req, res, next)=>{
    var valor_total = 0;
    Solicitud.find()
     .where('estado').equals('ACEPTADA')
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
    //actualizar estado de una solicitud
    app.put('/:id', mdAutenticacion.verificarToken, (req, res)=>{
        var id = req.params.id;
        var body = req.body;
        console.log(body);
        Solicitud.findById(id, (err, solicitudActualizada)=>{
            if(err){
                res.status(400).json({
                    ok:false,
                    mensaje:"no se pudo acceder a la base de datos",
                    solicitud:solicitudActualizada
                })
            }
            if(!solicitudActualizada){
                res.status(500).json({
                    ok:false,
                    mensaje:"no se encontro la solicitud en la db",
                    err:err
                })
            }
            console.log("el estado es");
            
            solicitudActualizada.estado = body.estado
            solicitudActualizada.save( (err, solicitudActualizada)=>{
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