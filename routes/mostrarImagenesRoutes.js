var express = require('express');
var path = require('path');
var fs = require('fs');
var app =  express();

app.get('/:tipo/:img', (req, res, next)=>{
    var img = req.params.img;
    var tipo = req.params.tipo;
    var pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);
    // =========si existe la imagen ==== //
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
        //sino mostremos la de los assets
    }else{
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }
});

module.exports = app;