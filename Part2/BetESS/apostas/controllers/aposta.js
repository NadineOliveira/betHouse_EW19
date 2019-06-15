var Aposta = require('../models/aposta')

// Lista de apostas
module.exports.list = () => {
    return Aposta
        .find()
        .sort({data: 1})
        .exec()
}

// Lista de apostas por receber, dado um utilizador
module.exports.listReceber = (email) => {
    return Aposta
        .find({recebido: 0, user : email})
        .sort({data: 1})
        .exec()
}

// Lista de apostas recebidas, dado um utilizador
module.exports.listRecebidas = (email) => {
    return Aposta
        .find({recebido: 1, user : email})
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