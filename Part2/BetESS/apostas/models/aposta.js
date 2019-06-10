var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ApostaSchema = new Schema({
    data: {type: String, required: true},
    valor: {type: Number, required: true},
    prognostico: {type: Number, required: true},
    recebido: {type: Number, required:true},
    evento: {type: Schema.Types.ObjectId, required: true},
    //user: {type: String, required: true},
})


module.exports = mongoose.model('Aposta', ApostaSchema, 'apostas')
