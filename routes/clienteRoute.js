var express = require('express');
var Cliente = require('../models/clienteModel');
var mdAutenticacion = require('../middlewares/autenticacion');
//inicialziar variables
var app = express();

//get obtener todos los clientes
app.get('/',  (req, res, next)=>{
    Cliente.find({})
     .exec((err, clientes)=>{
      if(err){
        res.status(500).json({
          ok:false,
          mensaje:"no se pudieron traer los datos",
          errors:err
       });
      }
      Cliente.count({}, (err, conteo)=>{
        res.status(200).json({
            ok:true,
            mensaje:"peticion realizada correctamente",
            clientes:clientes,
            total:conteo
         });
      })
    });
  });

  //obtener un solo cliente
  app.get('/:id', (req, res, next)=>{
      var id = req.params.id;
      Cliente.findById(id)
      .exec((err, cliente)=>{
        if(err){
            res.status(400).json({
              ok:false,
              mensaje:"error al acceder la db",
              errors:err
           });
          }
         if(!cliente){
           res.status(500).json({
             ok:false,
            mensaje:"no existe el cliente",
            errors:err
         });
        }
        //si existe
        res.status(200).json({
            ok:false,
           mensaje:"!exitoooo",
           cliente:cliente
        });  
      })
  })
  
  //Crear cliente
  app.post('/',  mdAutenticacion.verificarToken, (req, res, next)=>{
      var body = req.body;
      console.log(body);
      var cliente = new Cliente({
          nombre:body.nombre,
          nit: body.nit,
          email:body.email,
          direccion : body.direccion,
          telefono:body.telefono,
          celular1:body.celular1,
          celular2:body.celular2,
          contacto:body.contacto
      })

      cliente.save((err, clienteGuardado)=>{
        if(err){
            res.status(400).json({
              ok:false,
              mensaje:"no se pudo acceder a la base de datos",
              errors:err
           });
          }
        if(!clienteGuardado){
            res.status(500).json({
                ok:false,
                mensaje:"no llegaron los datos",
                errors:err
             });
        }
        res.status(200).json({
            ok:true,
            mensaje:"!exitoooo",
            cliente:clienteGuardado
         });  
      })
  });
  //actualizar clientes
  app.put('/:id',  mdAutenticacion.verificarToken, (req, res, next)=>{
      var body = req.body;
      var id = req.params.id;

      Cliente.findById(id)
        .exec((err, cliente)=>{
            if(err){
                res.status(400).json({
                  ok:false,
                  mensaje:"no se pudo acceder a la base de datos",
                  errors:err
               });
            }
            if(!cliente){
                res.status(500).json({
                    ok:false,
                    mensaje:"no existe el cliente",
                    errors:err
                 });
            }

            cliente.nombre = body.nombre;
            cliente.nit = body.nit;
            cliente.email = body.email;
            cliente.telefono = body.telefono;
            cliente.celular1 = body.celular1;
            cliente.celular2 = body.celular2;
            cliente.contacto = body.contacto;
            
            cliente.save((err, clienteActualizado)=>{
                if(err){
                    res.status(400).json({
                      ok:false,
                      mensaje:"no se pudo acceder a la base de datos",
                      errors:err
                   });
                }
                if(!clienteActualizado){
                    res.status(500).json({
                        ok:false,
                        mensaje:"no se pudo actualizar el cliente",
                        errors:err
                     });
                }
                res.status(200).json({
                    ok:true,
                    mensaje:"!exito cliente actualizado",
                    clienteActualizado:clienteActualizado
                 });
            });
        });
  });
  /*
  //get Hospital es decir uno solo
    app.get('/hospital/:id',  (req, res, next)=>{
        var id = req.params.id;
        
        Hospitales.findById(id)
            .populate('usuario', 'nombre img email')
            .exec((err, hospital)=>{
                if(err){
                    res.status(500).json({
                    ok:false,
                    mensaje:"no se pudieron traer los datos",
                    errors:err
                    });
                }
                if(!hospital){
                    res.status(400).json({
                    ok:false,
                    mensaje:"no existe",
                    errors:err
                    });
                }
                res.status(200).json({
                    ok:true,
                    hospital:hospital
                });       

            })

   
    });
    //post  crear usuario
    app.post('/hospitales', mdAutenticacion.verificarToken,  (req, res, next)=>{

        var body = req.body
        var hospital = new Hospitales({
            nombre : body.nombre,
            img : body.imagen,
            usuario: req.usuario._id,  
        });
        console.log(hospital.img);
        
        
        hospital.save((err, hospitalGuardado)=>{
          if(err){
              res.status(400).json({
              ok:false,
              mensaje:"no se pudieron traer los datos",
              errors:err
          });
          }
          res.status(201).send({
              hospitalGuardado :hospitalGuardado,
              usuarioToken: req.usuario,
              ok:true
          });
        });
    });
    //put actualizar usuarios
    app.put('/hospitales/:id', mdAutenticacion.verificarToken, (req, res)=>{
        var id = req.params.id;
        var body = req.body;
    
        Hospitales.findById(id, (err, hospital)=>{
        if(err){
            res.status(500).json({
            ok:false,
            mensaje:"no se pudieron traer los datos",
            errors:err
        });
        }
        if(!hospital){
            res.status(400).json({
            ok:false,
            mensaje:"no existe el usuario",
        });
        }
        //si si existe
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;
        hospital.img = body.img;
    
        hospital.save( (err, hospitalActualizado)=>{
            if(err){
                res.status(400).json({
                    ok:false,
                    mensaje:"Error al actualizar hospital",
                    errors:err
                });
            }
        
            if(hospitalActualizado){
                res.status(201).send({
                    hospital: hospitalActualizado,
                    ok:true
                });
            }
        });
      });
    });
    //delete usuario
    app.delete('/hospitales/:id', mdAutenticacion.verificarToken, (req, res)=>{
        var id = req.params.id;
    
        Hospitales.findByIdAndRemove(id, (err, hospitalBorrado)=>{
        if(err){
            res.status(400).json({
            ok:false,
            mensaje:"no se pudo borrar hospital",
            errors:err
        });
        }
        res.status(200).json({
            ok:true,
            mensaje:"peticion realizada correctamente",
            hospital:hospitalBorrado
        });
      });
    });*/

module.exports=app;