'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema de solicitudes

var SolicitudSchema = Schema({
    numero: {type:String},
    item:[{
        campo1:{type:String},
        campo2:{type:String}
    }]
});

//exportando el Schema
module.exports = mongoose.model('Solicitud', SolicitudSchema, "solicitudes");
