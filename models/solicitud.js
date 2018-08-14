'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema de solicitudes

var SolicitudSchema = Schema({
    item:[{
        campo1:{type:String},
        campo2:{type:String}
    }],
    numero: {type:String},
    medico:{type: Schema.Types.ObjectId,  ref: 'Medicos'} 

    
});

//exportando el Schema
module.exports = mongoose.model('Solicitud', SolicitudSchema, "solicitudes");
