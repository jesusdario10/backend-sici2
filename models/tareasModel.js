var mongoose =require('mongoose');
var Schema =mongoose.Schema;
var TareaSchema =new Schema({
		nombre: {type: String,	required: [true, 'El	nombre	es	necesario']	},
        tipomtto: {type: Schema.Types.ObjectId,	ref: 'Tipomtto'}      
});
module.exports = mongoose.model('Tarea',	TareaSchema);

