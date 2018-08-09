var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Usuario = require('../models/usuarioModel');
var SEED = require('../config/config').SEED;
var GoogleAuth = require('google-auth-library');

var app = express();


app.post('/', (req, res)=>{
    var body = req.body;
    Usuario.findOne({correo:body.correo}, (err, usuarioDB)=>{
        
        if(err){
            res.status(500).json({
              ok:false,
              mensaje:"no se pudo buscar correo",
              errors:err
            });
        }
        if(!usuarioDB){
            res.status(500).json({
                ok:false,
                mensaje:"no se encontro el correo",
                errors:err
              });
        }
        //verificamos la contraseña

        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                mensaje:"Contraseña inconrrecta",
                errors:err
              });
        }
        //crear un token

        usuarioDB.password=":)rrrrr";
        var token = jwt.sign({usuario:usuarioDB}, SEED, {expiresIn:14400});//4 horas
        
        res.status(200).json({
            ok:true,
            usuario:usuarioDB,
            token:token
        })


    })



})

module.exports = app;