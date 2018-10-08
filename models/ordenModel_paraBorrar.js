'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema de solicitudes
var OrdenSchema = Schema({
    solicitud: {type: Schema.Types.ObjectId,	ref: 'Solicitud', required:true },
    cliente: {type: Schema.Types.ObjectId,	ref: 'Cliente', required:true },
    ejecutado: {tupe:Number},
    cantidad : {type:Number},
    valvulas : [{
        tipovalvula:{type:String} ,
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
        tareas:[{
            nombre: String,
            estado : String,
            tipo : String
        }]
    }],
    valor :{type:Number},
    estado :{type:String, default:"Incompleta"}
});



//exportando el Schema
module.exports = mongoose.model('Orden', OrdenSchema, "ordenes");
