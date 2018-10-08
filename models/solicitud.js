'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema de solicitudes

var SolicitudSchema = Schema({
    item:[{
        tipovalvula:{type: Schema.Types.ObjectId,	ref: 'Solicitud', required:true },
        tiposello:{type:String} ,
        diametro:{type:String} ,
        rating:{type:String} ,
        material:{type:String} ,
        otrosdatos:{type:String} ,
        tipomtto:{type:String} ,
        prioridad:{type:String} ,
        dificultad:{type:String} ,
        sitio:{type:String} ,
        cantidad:{type:Number},
        valor:{type:Number},
        tareas :{type: Array},
        fechaRequerida : {type : Date} 
    }],
    valorTotal:{type:Number},
    nombre:{type:String},
    estado: {type:String, default:"CREADA"},
    cliente: {type: Schema.Types.ObjectId,	ref: 'Cliente', required:true },
    cargo: {type: Schema.Types.ObjectId,	ref: 'Cargo', required:true },
    date: { type: Date, default: Date.now },
    fechaInicial: { type: Date },
    fechaFinal: { type: Date },
    fechaEspera : {type : Date}

    
});

//exportando el Schema
module.exports = mongoose.model('Solicitud', SolicitudSchema, "solicitudes");
