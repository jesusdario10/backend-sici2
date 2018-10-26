var express = require('express');
var app = express();
var Mantenimiento = require('../models/mantenimientoModel');
var Solicitud = require('../models/solicitud');
var moment = require('moment');



//=================INFORME DE MANTENIMIENTOS PARA LOS CLIENTES EN DONA================//
//MOSTRAR MANTENIMIENTOS ENTRE FECHAS
app.post('/donamanten', (req, res, next)=>{
    var body = req.body;
    var capturaFechaInicial = new Date(body.fechaInicial);
    var capturaFechaFinal =  new Date(body.fechaFinal);
    console.log("este es el body del mantenimiento para consultar con dona");
    Mantenimiento.find({"$and": [{"fechaInicio":{"$gte":capturaFechaInicial}},{"fechaInicio":{"$lte":capturaFechaFinal}},{cliente:body.cliente}]})
      .populate('tipovalvula', 'nombre')
      .exec((err, mantenimientos)=>{
        Mantenimiento.count({"$and": [{"fechaInicio":{"$gte":capturaFechaInicial}},{"fechaInicio":{"$lte":capturaFechaFinal}},{cliente:body.cliente}]}, (err, conteo)=>{
          res.status(200).json({
            ok:true,
            mantenimientos: mantenimientos,
            contMantenimientos : conteo
         });
        });
      })
  })
//  ===========INFORME DE MANTENIMIENTOS PARA CLIENTES EN LINEA========================//
//MOSTRAR MANTENIMIENTOS ENTRE FECHAS
app.post('/lineamanten', (req, res, next)=>{
  var body = req.body;
  var capturaFechaInicial = new Date(body.fechaInicial);
  var capturaFechaFinal =  new Date(body.fechaFinal);
  console.log("este es el body del mantenimiento");
  

  if(capturaFechaInicial == undefined && capturaFechaFinal == undefined || body.fechaInicial == '' && body.fechaFinal == '' ){
    console.log("ambos vacios");
      capturaFechaInicial = new Date('2018-01-01');
      capturaFechaFinal = new Date('2080-01-01');
    console.log("1");
}
//==========SI EL USUARIO ENVIA TANTO LA FECHA INICIAL COMO LA FINAL ====//
if(capturaFechaInicial !== undefined && capturaFechaFinal !== undefined){
    capturaFechaInicial = new Date(body.fechaInicial);
    capturaFechaFinal = new Date(body.fechaFinal);
    console.log("2");
}
//=================SI ELVIA SOLO LA FECHA FINAL========================//
if(capturaFechaInicial == undefined && capturaFechaFinal !== undefined){
    capturaFechaInicial = new Date('2018-01-01');
    capturaFechaFinal = new Date(body.fechaFinal);
    console.log("3");
}
//=================SI ELVIA SOLO LA FECHA INICIAL========================//
if(capturaFechaInicial !== undefined && capturaFechaFinal == undefined){
    capturaFechaInicial = new Date(body.fechaInicial);
    capturaFechaFinal = new Date('2080-01-01');
   console.log("4");
}


  /*
    1-milIni        = convirtiendo a minisegundos la fecha inicial
    2-milFin        = convirtiendo a milisegundos la fecha final
    3-diferencia    = restando las fechas para saber la diferencia en dias
    4-dia           = este valor equivale a un dia en milisegundos(1000*60*60*24) 
    5-dia2          = variable incrementadora de dias en milisegundos que usaremos en el for
    6-fecha         = contendra la fecha que se ira generando en el for
    7-numerodias    = division entre la diferencia y los dias todo esto se hace en milisegundos
                      para QUE nos de un numero entero que usaremos en el for como limite de iteraciones
    8-arrayfechas   = contendra las fechas que se generaron en el for                  
  */
  var milIni = capturaFechaInicial.getTime();
  var milFin = capturaFechaFinal.getTime();
  var diferencia = milFin - milIni;
  const dia = 86400000;
  var dia2 = dia
  var fecha;
  var numeroDias = diferencia/dia;
  var ejecucion = 0;
  var detenidos = 0;
  var completos = 0;
  var arrayfechas = [];
  var arrayEjecucion = [];
  var arrayDetenidos = [];
  var arrayCompletos = [];
  


  Mantenimiento.find({"$and": [{"fechaInicio":{"$gte":capturaFechaInicial}},{"fechaInicio":{"$lte":capturaFechaFinal}},{cliente:body.cliente}]})
    .populate('tipovalvula', 'nombre')
    .exec((err, mantenimientos)=>{
    
      for(var i = 0 ; i<= numeroDias; i++){
        fecha = moment(new Date(milIni+dia2)).format('YYYY-MM-DD');
        dia2 = dia + dia2;
        arrayfechas.push(fecha); 
        
        for(var y =0; y< mantenimientos.length; y++){
          let = fechaInicioMantenimiento = moment(new Date(mantenimientos[y].fechaInicio)).format('YYYY-MM-DD');
          let = fechaCompletadoelMantenimiento = moment(new Date(mantenimientos[y].fechaFin)).format('YYYY-MM-DD');
          let = fechaDetenidoelMantenimiento = moment(new Date(mantenimientos[y].fechaDetenido)).format('YYYY-MM-DD');

          //------------------------ejecucion-----------------------------------------//
          if( fecha == fechaInicioMantenimiento){
            ejecucion = ejecucion + 1; 
          }
          if(fecha == fechaDetenidoelMantenimiento ){
            console.log(fecha, ' - ', fechaDetenidoelMantenimiento );
            ejecucion = ejecucion - 1;
            detenidos = detenidos + 1; 
          }
          //------------------------detenidos------------------------------------------//
          if( fecha == fechaDetenidoelMantenimiento  && mantenimientos[y].estado == 'DETENIDO'){
            
            if(mantenimientos[y].estadoAnterior2 =='EJECUCION'){
              detenidos = detenidos - 1; 
              ejecucion = ejecucion + 1;
            }

          }
          
          //-------------------------completados----------------------------------------//
          if( fecha == fechaCompletadoelMantenimiento && mantenimientos[y].estado == 'COMPLETADO'){
            completos = completos + 1; 
            if(mantenimientos[y].estadoAnterior =='DETENIDO'){
              detenidos = detenidos - 1; 
            }
            if(mantenimientos[y].estadoAnterior =='EJECUCION'){
              ejecucion = ejecucion - 1;
            }
          } //----fin
 

          if(ejecucion < 0){
            ejecucion = 0;
          }
        }
        arrayEjecucion[i]= ejecucion;
        arrayDetenidos[i]= detenidos;
        arrayCompletos[i]= completos;
      }
      console.log("array ejecucion ", arrayEjecucion);
      console.log("array detenidos ", arrayDetenidos);
      console.log("array completos ", arrayCompletos);
      Mantenimiento.count({"$and": [{"fechaInicio":{"$gte":capturaFechaInicial}},{"fechaInicio":{"$lte":capturaFechaFinal}}, {cliente:body.cliente}]}, (err, conteo)=>{
        res.status(200).json({
          ok:true,
          fechas : arrayfechas,
          mantenimientos: mantenimientos,
          ejecucion:arrayEjecucion,
          detenidos :arrayDetenidos,
          completos : arrayCompletos,
          contMantenimientos : conteo

       });
      });
    })
})

//===================INFORME DE SOLICITUDES PARA CLIENTES EN DONA===============//
app.post('/donasolici', (req, res, next)=>{
  var body = req.body;
  console.log("esto es el body: ", body); 
 
  var fechaInicial = new Date(body.fechaInicial);
  var fechaFinal = new Date(body.fechaFinal);   

  Solicitud.find({"$and": [{"date":{"$gte":fechaInicial}},{"date":{"$lte":fechaFinal}}, {cliente:body.cliente}]})
      .populate('cliente', 'nombre')
      .exec((err, solicitudes)=>{
          if(err){
              res.status(500).json({
                  ok:false,
                  mensaje:"no se pudieron traer los datos",
                  errors:err
               });  
          }
          Solicitud.count({"$and": [{"date":{"$gte":fechaInicial}},{"date":{"$lte":fechaFinal}},  {cliente:body.cliente}]})
              .exec((err, conteo)=>{
                  res.status(200).json({
                      ok:true,
                      solicitudes : solicitudes,
                      cantidad : conteo
                  });
              })
  });
})
    


module.exports = app;