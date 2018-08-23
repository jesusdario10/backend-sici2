var mongoose =require('mongoose');
var Schema =mongoose.Schema;
var TipomttoSchema =new Schema({
		nombre: {type: String,	required: [true, 'El	nombre	es	necesario']	}
});
module.exports = mongoose.model('Tipomtto',	TipomttoSchema);

