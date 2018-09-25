'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema de solicitudes

var tipoValvulaSchema = Schema({
    nombre: {type:String} ,
    actividades:[{
        nombre:{type:String},
        tipo:{type:String},
        estado:{type:String, default:"ESPERA"},
        date: { type: Date, default: Date.now }
    }],   
    date: { type: Date, default: Date.now }

    
});



//exportando el Schema
module.exports = mongoose.model('TipoValvula', tipoValvulaSchema, "tipovalvulas");