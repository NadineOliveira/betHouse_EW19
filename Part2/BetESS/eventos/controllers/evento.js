var Evento = require('../models/evento')

const getDataHoraAtual = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var time = hours + ":" + minutes;

    today = yyyy + '-' + mm + '-' + dd;
    return {today, time}

}

// Lista de eventos
module.exports.list = () => {
    return Evento
        .find()
        .sort({data: 1})
        .exec()
}


// 5 eventos
module.exports.topList = async () => {
    var date = new Date();
    var stringDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-'+ date.getDate()
    return await Evento
        .find({data: {$lt: stringDate}})
        .sort({data: -1})
        .limit(5)
        .exec()
}

// Lista de eventos por Estado para utilizadores normais
module.exports.listByEstado = estado => {
    var obj = getDataHoraAtual()
    var dataAtual = obj.today
    var horaAtual = obj.time

    console.log(dataAtual, horaAtual)
    return Evento
    .find({estado: estado, premium : false, $or : [{data : {$gt : dataAtual}}, {$and : [{data : {$eq : dataAtual}}, {hora : {$gte : horaAtual}}]} ]} )
    .sort({date: -1})
    .exec()
}


// Lista de eventos por Estado para utilizadores premium
module.exports.listByEstadoPremium = estado => {
    var obj = getDataHoraAtual()
    var dataAtual = obj.today
    var horaAtual = obj.time

    return Evento
    .find({estado: estado, $or : [{data : {$gt : dataAtual}}, {$and : [{data : {$eq : dataAtual}}, {hora : {$gte : horaAtual}}]} ] })
    .sort({date: -1})
    .exec()
}

module.exports.listConcluidos = () => {

    return Evento
    .find({estado: {$ne: 0}})
    .sort({date: -1})
    .exec()
}


// Lista de eventos que já acabaram mas ainda não estao fechados pelo admin
module.exports.listPorConcluir = () => {
    
    var obj = getDataHoraAtual()
    var dataAtual = obj.today
    var horaAtual = obj.time

    // Eventos com data anterior a hoje ou com data de hoje e hora anterior a hora atual
    return Evento
    .find({estado : 0 , $or : [{data : {$lt : dataAtual}}, {$and : [{data : {$eq : dataAtual}}, {hora : {$lt : horaAtual}}]} ]})
    .sort({data: -1})
    .exec()
}

// Lista de eventos por Data
module.exports.listByExactDate = data => {
    return Evento
    .find({data: data})
    .sort({data: -1})
    .exec()
}

// Devolve a informação do evento por id
module.exports.getById = id => {
    return Evento
    .findOne({_id: id})
    .exec()
}

module.exports.insert = event => {
    return Evento.create(event)
}

module.exports.finishEvent = async (id, result, resultado) => {
    var event = await this.getById(id)
    
    if(!event)
      throw new Error("Evento não encontrado!")
    
    return Evento.findByIdAndUpdate({_id: id},{$set: {estado: result, resultado: resultado}})
            .exec()
    
}


module.exports.delete = async (id) => {
    event = await this.getById(id)

    
    await Evento
            .remove({_id: id })
            .exec()
    
}