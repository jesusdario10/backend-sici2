var SEED = require('../config/config').SEED;
var jwt = require('jsonwebtoken');

// ======================================
// Middleware para verificar por token
// ======================================

exports.verificarToken = function(req, res, next){
    var token = req.query.token;
  
    jwt.verify( token, SEED, (err, decoded)=>{
      if(err){
        res.status(401).json({
          ok:false,
          mensaje:"token incorrecto",
          errors:err
       });
      }
      if(decoded){
        req.usuario = decoded.usuario;
        next();
      }

    });
}
// ================================================
// Middleware para que el usuario sea administrador
// ================================================
exports.verificaADMIN_ROLE = function(req, res, next){
  
  var usuario = req.usuario;
  //Si usuario es administraor  dejalo pasar es decir has next()
  if(usuario.role === "ADMIN_ROLE"){
    next();
    return;
  }else{
    //sino es enviamos el error
    res.status(401).json({
      ok:false,
      mensaje:"Token incorrecto- No es Adminsitrador",
      errors:{message :'No es Administrador no puede hacer esto'}
   });
  }

}
// ================================================
// Middleware verifica Admin o mismo usuario
// ================================================
exports.verificaADMIN_o_MismoUsuario = function(req, res, next){
  
  var usuario = req.usuario;
  var id = req.params.id
  //Si usuario es administraor  dejalo pasar es decir has next()
  if(usuario.role === "ADMIN_ROLE" || usuario._id ===id){
    next();
    return;
  }else{
    //sino es enviamos el error
    res.status(401).json({
      ok:false,
      mensaje:"Token incorrecto- No es Adminsitrador ni es el mismo usuario",
      errors:{message :'No es Administrador no puede hacer esto'}
   });
  }
}  
  // ================================================
// Middleware verifica si es admin o cliente para insercion de items
// ================================================
exports.verificarClienteOadmin= function(req, res, next){
  var usuario = req.usuario;
  var idcliente = req.params.cliente
  console.log(usuario.cliente);
  console.log(idcliente);

  
  //Si usuario es administraor  dejalo pasar es decir has next()
  if(usuario.role === "ADMIN_ROLE" || usuario.cliente === idcliente){
    next();
    return;
  }else{
    //sino es enviamos el error
    res.status(401).json({
      ok:false,
      mensaje:"Token incorrecto- No es Adminsitrador ni es el cliente",
      errors:{message :'No es Administrador no puede hacer esto'}
   });
  }
 }
