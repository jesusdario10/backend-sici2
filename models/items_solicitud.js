'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema de solicitudes

var Item_SolicitudSchema = Schema({

    tipovalvula: {type: String},
    tiposello: {type: String},
    diametro: {type: String},
    rating: {type: String},
    material: {type: String},
    otrosdatos: {type: String},
    tipomtto: {type: String},
    prioridad: {type: String},
    dificultad: {type: String},
    sitio: {type: String},
    cantidad: {type: Number},
    solicitud: {type: Schema.Types.ObjectId,	ref: 'Solicitud', required:true },
    

});

//exportando el Schema
module.exports = mongoose.model('Item_solicitudes', Item_SolicitudSchema, "item_solicitudes");

