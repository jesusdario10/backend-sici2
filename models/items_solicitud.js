'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema de solicitudes

var Item_SolicitudSchema = Schema({
    nosolicitud : {type : Schema.Types.ObjectId, ref:'Solicitud'},
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
    cantidad: {type: String}
});

//exportando el Schema
module.exports = mongoose.model('Item_solicitudes', Item_SolicitudSchema, "item_solicitudes");
