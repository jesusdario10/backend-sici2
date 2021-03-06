'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema de solicitudes

var MantenimientoSchema = Schema({
    solicitud: {type: Schema.Types.ObjectId,	ref: 'Solicitud'},
    serie:{type:String} ,
    tipovalvula:{type: Schema.Types.ObjectId,	ref: 'TipoValvula'},
    tiposello:{type:String} ,
    diametro:{type:String} ,
    rating:{type:String} ,
    material:{type:String} ,
    otrosdatos:{type:String},
    tipomtto:{type:String} ,
    prioridad:{type:String} ,
    dificultad:{type:String} ,
    sitio:{type:String} ,
    cantidad:{type:Number},
    valor:{type:Number},
    tareas :[{
        estado : {type : Boolean},
        _id : {type : String},
        nombre : {type : String},
        tipo : {type:String},
        tiempo : {type :Number}
    }],
    //observaciones
    obsTipovalvula : {type: String},
    obsCuerpo : {type: String},
    obsComponentes : {type: String},
    obsTmttoPrioUbi : {type: String},
    obsDificultad : {type: String},
    estado: {type:String, default:"EJECUCION"},
    estadoAnterior : {type:String},
    estadoAnterior2 : {type:String},
    obsEstado : {type:String},
    fechaInicio :  { type: Date},
    fechaDetenido:  { type: Date},
    fechaFin :  { type: Date},
    estadoactividades : {type : Boolean, default:false},
    cliente : {type: Schema.Types.ObjectId,	ref: 'Cliente'}
});

//exportando el Schema
module.exports = mongoose.model('Mantenimiento', MantenimientoSchema, "mantenimientos");
