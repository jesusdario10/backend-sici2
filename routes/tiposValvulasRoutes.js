var express = require('express');
var Solicitud = require('../models/solicitud');
var TipoValvula = require('../models/tipoValvulasModel');
var mdAutenticacion = require('../middlewares/autenticacion');
var moment = require('moment');
//inicialziar variables
var app = express();



//Listar tipos de Valvula
app.get('/',  (req, res, next)=>{

    TipoValvula.find({})
        .exec((err, TiposdeValvulas)=>{
            if(err){
                res.status(400).json({
                    ok:false,
                    mensaje:"Error al buscar",
                    error:err
                
                })
            }
            if(!TiposdeValvulas){
                res.status(500).json({
                    ok:false,
                    mensaje:"eno se encontraron datos",
                })
            }
            res.status(200).json({
                ok:true,
                mensaje:"!Exito",
                tipovalvulas : TiposdeValvulas
            });
        })

   
});

//Crear Tipos de Valvulas
app.post('/crear', (req, res, next)=>{
    var body = req.body;

    var tipoValvula = new TipoValvula({
        nombre: body.nombre
    })
    
    tipoValvula.save((err, TipoValvulaGuardada)=>{
        if(err){
            res.status(400).json({
                ok:false,
                mensaje:"Error al insertar",
                error:err
            
            })
        }
        if(!TipoValvulaGuardada){
            res.status(500).json({
                ok:false,
                mensaje:"el usuario no inserto datos",
            })
        }
        res.status(200).json({
            ok:true,
            mensaje:"!Exito",
            tipovalvula : TipoValvulaGuardada
        });

    });
});

//Editar Tipos de Valvulas
app.put('/editar/:id', (req, res, next)=>{
    var id = req.params.id;
    var body = req.body;
    console.log(body);

    TipoValvula.findById(id, (err, tvalvula)=>{
        if(err){
            res.status(400).json({
                ok:false,
                mensaje:"Error al actualizar",
                error:err
            
            });
        }
        if(!tvalvula){
            res.status(500).json({
                ok:false,
                mensaje:"no existe",
            })
        }
        tvalvula.nombre = body.nombre

        tvalvula.save((err, tvalvulaActualizada)=>{
            if(err){
                res.status(400).json({
                    ok:false,
                    mensaje:"Error al actualizar",
                    error:err
                
                });
            }
            res.status(200).json({
                ok:true,
                mensaje:"!Exito",
                tvalvula: tvalvulaActualizada
            });
        });

    });

});

//Inserta Actividades a los tipos de Valvula
app.post('/:id', (req, res, next)=>{
    var id = req.params.id;
    var body = req.body;

    var objetoInsertarPrueba = {
        nombre: body.nombre
    }

    TipoValvula.findById(id, (err, tipovalvula)=>{
        if(err){
            res.status(400).json({
                ok:false,
                mensaje:"Error se buscar",
                error:err
            
            });
        }
        if(!tipovalvula){
            res.status(500).json({
                ok:false,
                mensaje:"No existe"
           });
        } 
       tipovalvula.actividades.push(objetoInsertarPrueba) 

       tipovalvula.save((err, tipovalvulaGuardado)=>{
            if(err){
                res.status(400).json({
                    ok:false,
                    mensaje:"Error se insertar",
                    error:err
                
                });
            }
            if(!tipovalvulaGuardado){
                res.status(500).json({
                    ok:false,
                    mensaje:"No existen datos"
               });
            }
            res.status(200).json({
                ok:true,
                mensaje:"!Exito",
                tipovalvula:tipovalvulaGuardado

            }); 
       });
    });
});


 
module.exports=app;