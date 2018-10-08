var express = require('express');
var TipoMtto = require('../models/tipomtto');
var mdAutenticacion = require('../middlewares/autenticacion');
//inicialziar variables
var app = express();
//listar los tipos de mantenimientos
app.get('/',  [mdAutenticacion.verificarToken, mdAutenticacion.verificaADMIN_ROLE], (req, res, next)=>{

    TipoMtto.find({})
        .exec((err, tiposMtto)=>{
            if(err){
                res.status(400).json({
                    ok:false,
                    mensaje:"no se pudo tener acceso a la db"
                });
            }
            if(!tiposMtto){
                res.status(500).json({
                    ok:false,
                    mensaje:"no se encontraron datos en la db"
                });
            }
            res.status(200).json({
                ok:true,
                mensaje:"!Exito",
                tiposMtto:tiposMtto
            });
        });
});
//crear tipos demantenimiento
app.post('/', [mdAutenticacion.verificarToken, mdAutenticacion.verificaADMIN_ROLE],  (req, res, next)=>{
    var body = req.body;
    var tipoMtto = new TipoMtto({
        nombre : body.nombre
    });
    
    tipoMtto.save((err, tipoGuardado)=>{
        if(err){
            res.status(400).json({
                ok:false,
                mensaje:"no se pudo tener acceso a la db"
            });
        }
        if(!tipoGuardado){
            res.status(500).json({
                ok:false,
                mensaje:"no llego ningun tipoMtto para guardar"
            });
        }
        res.status(200).json({
            ok:true,
            mensaje:"!exito",
            tipoMtto:tipoGuardado
        });
        
    })
    
});

module.exports = app;