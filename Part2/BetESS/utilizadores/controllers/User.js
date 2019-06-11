var User = require('../models/User')

// Lista de utilizadores
module.exports.list = () => {
    return User
        .find()
        .sort()
        .exec()
}



// Devolve o saldo dado um email
module.exports.getSaldo = email => {
    return User
    .findOne({email: email}, {_id:0, saldo: 1})
    .exec()
}


module.exports.retiraSaldo = (email, valorGasto) => {
    return User
    .findOneAndUpdate({email: email},{$inc: {saldo: -valorGasto}})
    .exec()
}