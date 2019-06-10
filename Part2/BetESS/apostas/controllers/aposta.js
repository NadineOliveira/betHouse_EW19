var Aposta = require('../models/aposta')

// Lista de apostas
module.exports.list = () => {
    return Aposta
        .find()
        .sort({data: 1})
        .exec()
}

// Lista de apostas por receber
module.exports.listReceber = () => {
    return Aposta
        .find({recebido: 0})
        .sort({data: 1})
        .exec()
}

// Lista de apostas recebidas
module.exports.listRecebidas = () => {
    return Aposta
        .find({recebido: 1})
        .sort({data: 1})
        .exec()
}

// Lista de apostas por evento
module.exports.listByEvento = evento => {
    return Aposta
    .find({evento: evento})
    .sort({date: -1})
    .exec()
}

// Lista de Aposta por Data
module.exports.listByExactDate = data => {
    return Aposta
    .find({data: data})
    .sort({data: -1})
    .exec()
}

// Devolve a informação da aposta por id
module.exports.getById = id => {
    return Aposta
    .findOne({_id: id})
    .exec()
}

module.exports.insert = aposta => {
    return Aposta.create(aposta)
}

module.exports.payAposta = async (id) => {
    var aposta = await this.getById(id)

    if(!aposta)
      throw new Error("Aposta não encontrado!")
    
    
      return Aposta.findByIdAndUpdate({_id: id},{$set: {recebido: 1}})
            .exec()
    
}


module.exports.delete = async (id) => {
    aposta = await this.getById(id)

    
    await Aposta
            .remove({_id: id })
            .exec()
    
}