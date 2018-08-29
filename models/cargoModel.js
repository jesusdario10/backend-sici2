var mongoose =require('mongoose');
var Schema =mongoose.Schema;
var cargoSchema =new Schema({
		nombre: {type: String},
        valorHora: {type: Number }	
});

module.exports = mongoose.model('Cargo',cargoSchema);

