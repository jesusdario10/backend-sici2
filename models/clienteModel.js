var mongoose =require('mongoose');
var Schema =mongoose.Schema;
var clienteSchema =new Schema({
		nombre: {type: String},
        nit: {type: String },
        email: {type: String },
        direccion: {type: String },
        telefono: {type: String },
        celular1: {type: String },
        celular2: {type: String },
        contacto: {type: String }
		
});

module.exports = mongoose.model('Cliente',	clienteSchema);

