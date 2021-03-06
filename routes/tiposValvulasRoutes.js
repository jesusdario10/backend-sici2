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
    console.log(body);
    

    var objetoInsertarPrueba = {
        nombre: body.actividades.nombre,
        tipo : body.actividades.tipo,
        tiempo : 0,
        img :''
    }
    //console.log(objetoInsertarPrueba);

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
       tipovalvula.actividades.push(objetoInsertarPrueba);
       

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



//LISTAR ACTIVIDADES Basicas Generales y todas
app.get('/:id', (req, res, next)=>{
    var id = req.params.id

    TipoValvula.findById(id, (err, tipovalvula)=>{
        if(err){
            res.status(400).json({
                ok:false,
                mensaje:"Error se consultar",
                error:err
            });
        }
        if(!tipovalvula){
            res.status(500).json({
                ok:false,
                mensaje:"No existen datos"
           });
        }
        var actividadesBasicas = [];
        var actividadesGenerales = [];
        /* almacenar los que son basicos y generales*/
        for(var i = 0; i < tipovalvula.actividades.length; i++ ){  
            if(tipovalvula.actividades[i].tipo==="Basico"){
                actividadesBasicas.push(tipovalvula.actividades[i]);
            }
            if(tipovalvula.actividades[i].tipo==="General"){    
                actividadesGenerales.push(tipovalvula.actividades[i]);
            }         
        }
        res.status(200).json({
            ok:true,
            mensaje:"!Exito",
            basicas:actividadesBasicas,
            generales :actividadesGenerales,
            tipovalvula:tipovalvula


        }); 
    })
});
//LISTAR ACTIVIDADES BASICAS
app.get('/:id/basica', (req, res, next)=>{
    var id = req.params.id;
    TipoValvula.find({_id:id}, "actividades._id actividades.nombre actividades.estado actividades.tipo actividades.tiempo")
        .exec((err, tipovalvula)=>{
            if(err){
                res.status(400).json({
                    ok:false,
                    mensaje:"Se Encuentra en la Primera Opcion",
                    error:err
                });
                return false;
            }
            if(!tipovalvula){
                res.status(500).json({
                    ok:false,
                    mensaje:"No existen datos"
               });
            }
            console.log(tipovalvula[0].actividades.length);
            var actividadesBasicas = [];
            //almacenar las actividades basicas
            for(var i = 0; i < tipovalvula[0].actividades.length; i++ ){  
                if(tipovalvula[0].actividades[i].tipo==="Basico"){
                    actividadesBasicas.push(tipovalvula[0].actividades[i]);
                }     
            }

            res.status(200).json({
                ok:true,
                mensaje:"!Exito",
                basicas:actividadesBasicas
            }); 
        })

});

//LISTAR ACTIVIDADES GENERALES
app.get('/:id/generales', (req, res, next)=>{
    var id = req.params.id;
    TipoValvula.find({_id:id}, "actividades.nombre actividades.estado actividades.tipo")
        .exec((err, tipovalvula)=>{
            if(err){
                res.status(400).json({
                    ok:false,
                    mensaje:"Se Encuentra en la Primera Opcion",
                    error:err
                });
                return false;
            }
            if(!tipovalvula){
                res.status(500).json({
                    ok:false,
                    mensaje:"No existen datos"
               });
            }
            console.log(tipovalvula[0].actividades.length);
            var actividadesGenerales = [];
            //almacenar las actividades basicas
            for(var i = 0; i < tipovalvula[0].actividades.length; i++ ){  
                if(tipovalvula[0].actividades[i].tipo==="General"){
                    actividadesGenerales.push(tipovalvula[0].actividades[i]);
                }     
            }

            res.status(200).json({
                ok:true,
                mensaje:"!Exito",
                generales:actividadesGenerales
            }); 
        })
});



 
module.exports=app;