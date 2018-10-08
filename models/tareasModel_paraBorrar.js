var mongoose =require('mongoose');
var Schema =mongoose.Schema;
var TareaSchema =new Schema({
		nombre: {type: String,	required: [true, 'El	nombre	es	necesario']	},
        tipomtto1: {type: Schema.Types.ObjectId,	ref: 'Tipomtto'},
        tipomtto2: {type: Schema.Types.ObjectId,	ref: 'Tipomtto'},
        tipomtto3: {type: Schema.Types.ObjectId,	ref: 'Tipomtto'},
        valor: {type: Number}     
});
module.exports = mongoose.model('Tarea',	TareaSchema);

