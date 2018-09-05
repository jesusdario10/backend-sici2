var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Usuario = require('../models/usuarioModel');
var SEED = require('../config/config').SEED;
var GoogleAuth = require('google-auth-library');

var app = express();


app.post('/', (req, res)=>{
    var body = req.body;
    console.log(body);
    Usuario.findOne({correo:body.correo}, (err, usuarioDB)=>{
        if(err){
           return res.status(400).json({
              ok:false,
              mensaje:"Contraseña o Correo Inconrrecto",
              errors:err
            });
        }
        if(usuarioDB===null){
            res.status(401).json({
                ok:false,
                mensaje:"Contraseña o Correo Inconrrecto",
                errors:err
            })
        }
        if(usuarioDB != null){
            if(!bcrypt.compareSync(body.password, usuarioDB.password)){
                console.log("aqui viene el usuario db");
                console.log(usuarioDB.password);
                return res.status(400).json({
                    ok:false,
                    mensaje:"Contraseña o Correo Inconrrecto",
                    errors:err
                  });
            }
            //crear un token
            usuarioDB.password=":)rrrrr";
            var token = jwt.sign({usuario:usuarioDB}, SEED, {expiresIn:14400});//4 horas
            
            res.status(200).json({
                ok:true,
                usuario:usuarioDB,
                token:token,
                menu: obtenerMenu(usuarioDB.role)
            })
        }
      
    });
});



/***************FUNCION DE ENVIO DE MENU****************/
function obtenerMenu( ROLE ){

    var menu = [
        {
          titulo: "Mantenimientos",
          icono: "mdi mdi-folder-lock-open",
          submenu:[
            { titulo:"Dashboard", url:"/dashboard" },
            {titulo:"Solicitudes", url:'/solicitudes'}
            
          ]
    
        }
        /*{
          titulo:"Configuraciones",
          icono:"mdi mdi-wrench",
          submenu:[
            {titulo:"Tipos Mtto", url:"/tipomtto"},
            {titulo:"Tareas", url:"/tarea"},
            {titulo:"Usuarios", url:'/usuarios'},
            {titulo:"Clientes", url:"/clientes"},
            {titulo:"Cargos", url:"/cargos"}
          ]
        }*/
      ];
      
      //SI ES ADMINISTRADOR
      if(ROLE === 'ADMIN_ROLE'){
          menu.push(
            {
                titulo:"Administracion",
                icono:"mdi mdi-account-star-variant",
                submenu:[
                  {titulo:"Ordenes", url:'/ordenes'}
                ]
            },  
            {
                titulo:"Configuraciones",
                icono:"mdi mdi-wrench",
                submenu:[
                  {titulo:"Tipos Mtto", url:"/tipomtto"},
                  {titulo:"Tareas", url:"/tarea"},
                  {titulo:"Usuarios", url:'/usuarios'},
                  {titulo:"Clientes", url:"/clientes"},
                  {titulo:"Cargos", url:"/cargos"}
                ]
              }
          );
      }

    return menu;
}

module.exports = app;