var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EventoSchema = new Schema({
    odd1: {type: Number, required: true},
    oddx: {type: Number, required: true},
    odd2: {type: Number, required: true},
    data: {type: String, required: true},
    estado: {type: Number, required: true},
    equipa1: {type: String, required : true},
    equipa2: {type: String, required : true},
})


module.exports = mongoose.model('Evento', EventoSchema, 'eventos')
