var Evento = require('../models/evento')

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
    return Evento
    .find({estado: estado, premium : false})
    .sort({date: -1})
    .exec()
}


// Lista de eventos por Estado para utilizadores premium
module.exports.listByEstadoPremium = estado => {
    return Evento
    .find({estado: estado})
    .sort({date: -1})
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

module.exports.finishEvent = async (id, result) => {
    var event = await this.getById(id)
    
    if(!event)
      throw new Error("Evento não encontrado!")
    
    return Evento.findByIdAndUpdate({_id: id},{$set: {estado: result}})
            .exec()
    
}


module.exports.delete = async (id) => {
    event = await this.getById(id)

    
    await Evento
            .remove({_id: id })
            .exec()
    
}