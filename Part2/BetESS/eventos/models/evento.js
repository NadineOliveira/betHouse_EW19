var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EventoSchema = new Schema({
    odd1: {type: Number, required: true},
    oddx: {type: Number, required: true},
    odd2: {type: Number, required: true},
    data: {type: String, required: true},
    hora: {type: String, required: true},
    estado: {type: Number, required: true}, //1 - equipa 1, 2 - equipa 2, 3 - empate, 0 - nao acabou
    equipa1: {type: String, required : true},
    equipa2: {type: String, required : true},
    resultado: {type: String, required: false},
    premium : Boolean
})


module.exports = mongoose.model('Evento', EventoSchema, 'eventos')
