var express = require('express');
var Tarea = require('../models/tareasModel');
//inicialziar variables
var app = express();
//prueba
app.get('/',  (req, res, next)=>{

    Tarea.find({})
        .populate('tipomtto', 'nombre')
        .exec((err, tareas)=>{
            if(err){
                res.status(400).json({
                    ok:false,
                    mensaje:"no se pudo tener acceso a la db"
                });
            }
            if(!tareas){
                res.status(500).json({
                    ok:false,
                    mensaje:"no se encontraron datos en la db"
                });
            }
            res.status(200).json({
                ok:true,
                mensaje:"!Exito",
                tareas:tareas
            });
        });
});
//crear tarea
app.post('/', (req, res, next)=>{
    var body = req.body;
    var tarea = new Tarea({
        nombre:body.nombre,
        tipomtto:body.tipomtto
    });
    //guardando la tarea
    tarea.save((err, tareaGuardada)=>{
        if(err){
            res.status(400).json({
                ok:false,
                mensaje:"no se pudo acceder a la db",
                error:err
            });
        }
        if(!tarea){
            res.status(500).json({
                ok:false,
                mensaje:"no llego ninguna tarea"
            });
        }
        res.status(200).json({
            ok:true,
            mensaje:"!exito",
            tarea:tareaGuardada
        });
    });
})

module.exports = app;