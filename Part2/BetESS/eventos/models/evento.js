var mongoose = require('mongoose')
var Schema = mongoose.Schema

 var EventoSchema = new Schema({
    data: {type: String},
    equipa: {type: String, required : true},

})


module.exports = mongoose.model('Evento', EventoSchema, 'eventos')
