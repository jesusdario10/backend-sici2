
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rolesValidos = {
    values : ['ADMIN_ROLE', 'USER_ROLE'],
    message:'{VALUE} no es un rol permitido'
}

//Schema de usuarios
var UsuarioSchema = new Schema({
    nombre: {type:String, required: [true, "El nombre es requerido"]},
    correo: {type:String, unique:true, required: [true, "El correo es requerido"]},
    password: {type:String, required: [true, "La contraseña es necesaria"]},
    img: {type:String },
    role: {type:String, default:"USER_ROLE", enum: rolesValidos}
});

//exportando el Schema
module.exports = mongoose.model('Usuario', UsuarioSchema);
