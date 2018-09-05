var express = require('express');
var Cargo = require('../models/cargoModel');
var mdAutenticacion = require('../middlewares/autenticacion');
//inicialziar variables
var app = express();

//get obtener todos los cargos
app.get('/',  (req, res, next)=>{
    Cargo.find({})
     .exec((err, cargos)=>{
      if(err){
        res.status(500).json({
          ok:false,
          mensaje:"no se pudieron traer los datos",
          errors:err
       });
      }
      Cargo.count({}, (err, conteo)=>{
        res.status(200).json({
            ok:true,
            mensaje:"peticion realizada correctamente",
            cargos:cargos,
            total:conteo
         });
      })
    });
  });

  //obtener un solo cargo
  app.get('/:id', (req, res, next)=>{
      var id = req.params.id;
      Cargo.findById(id)
      .exec((err, cargo)=>{
        if(err){
            res.status(400).json({
              ok:false,
              mensaje:"error al acceder la db",
              errors:err
           });
          }
         if(!cargo){
           res.status(500).json({
             ok:false,
            mensaje:"no existe el cargo",
            errors:err
         });
        }
        //si existe
        res.status(200).json({
            ok:false,
           mensaje:"!exitoooo",
           cargo:cargo
        });  
      })
  })
  
  //Crear cargo
  app.post('/', mdAutenticacion.verificarToken, (req, res, next)=>{
      var body = req.body;
      console.log(body);
      var cargo = new Cargo({
          nombre:body.nombre,
          valorHora: body.valorHora
      })

      cargo.save((err, cargoGuardado)=>{
        if(err){
            res.status(400).json({
              ok:false,
              mensaje:"no se pudo acceder a la base de datos",
              errors:err
           });
          }
        if(!cargoGuardado){
            res.status(500).json({
                ok:false,
                mensaje:"no llegaron los datos",
                errors:err
             });
        }
        res.status(200).json({
            ok:true,
            mensaje:"!exitoooo",
            cargo:cargoGuardado
         });  
      })
  });
  //actualizar cargos
  app.put('/:id',  mdAutenticacion.verificarToken, (req, res, next)=>{
      var body = req.body;
      var id = req.params.id;

      Cargo.findById(id)
        .exec((err, cargo)=>{
            if(err){
                res.status(400).json({
                  ok:false,
                  mensaje:"no se pudo acceder a la base de datos",
                  errors:err
               });
            }
            if(!cargo){
                res.status(500).json({
                    ok:false,
                    mensaje:"no existe el cargo",
                    errors:err
                 });
            }

            cargo.nombre = body.nombre;
            cargo.valorHora = body.valorHora;

            
            cargo.save((err, cargoActualizado)=>{
                if(err){
                    res.status(400).json({
                      ok:false,
                      mensaje:"no se pudo acceder a la base de datos",
                      errors:err
                   });
                }
                if(!cargoActualizado){
                    res.status(500).json({
                        ok:false,
                        mensaje:"no se pudo actualizar el cargo",
                        errors:err
                     });
                }
                res.status(200).json({
                    ok:true,
                    mensaje:"!exito cargo actualizado",
                    cargoActualizado:cargoActualizado
                 });
            });
        });
  });


module.exports=app;