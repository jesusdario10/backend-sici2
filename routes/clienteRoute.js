var express = require('express');
var Cliente = require('../models/clienteModel');
var mdAutenticacion = require('../middlewares/autenticacion');
//inicialziar variables
var app = express();

//get obtener todos los clientes
app.get('/',  [mdAutenticacion.verificarToken, mdAutenticacion.verificaADMIN_ROLE],  (req, res, next)=>{
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
  app.get('/:id',  [mdAutenticacion.verificarToken, mdAutenticacion.verificaADMIN_ROLE], (req, res, next)=>{
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
  app.post('/',  [mdAutenticacion.verificarToken, mdAutenticacion.verificaADMIN_ROLE], (req, res, next)=>{
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
  app.put('/:id',   [mdAutenticacion.verificarToken, mdAutenticacion.verificaADMIN_ROLE], (req, res, next)=>{
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
  
module.exports=app;