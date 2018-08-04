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
