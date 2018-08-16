'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema de solicitudes

var SolicitudSchema = Schema({
    nombre: {type:String}
});

//exportando el Schema
module.exports = mongoose.model('Solicitud', SolicitudSchema, "solicitudes");
