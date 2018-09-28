'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema de solicitudes

var tipoValvulaSchema = Schema({
    nombre: {type:String} ,
    actividades:[{
        nombre:{type:String},
        tipo:{type:String},
        estado:{type:Boolean, default:false},
        date: { type: Date, default: Date.now },
        dateRalizacion : {type : Date}, 
        tiempo:{ type : Number},
        img : {type: String}
    }],   
    date: { type: Date, default: Date.now }
});



//exportando el Schema
module.exports = mongoose.model('TipoValvula', tipoValvulaSchema, "tipovalvulas");