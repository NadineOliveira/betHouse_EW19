var User = require('../models/User')
var bcrypt = require('bcrypt')

// Lista de utilizadores
module.exports.list = () => {
    return User
        .find()
        .sort()
        .exec()
}

module.exports.getUser = (email) => {
    return User 
        .findOne({email: email})
        .exec()
}

module.exports.comparePass = async (pass, hash) => {
    bcrypt.compare(pass, hash, function(err, res) {
        return res
    });
}

module.exports.validatePassword = async (email, password) => {
    user = await this.getUser(email)
    if(!user) 
        throw new Error("Utilizador não encontrado!")

    var compare = await user.isValidPassword(password)

    if(!compare)
        throw new Error ("Invalid password")

    return user
}


// Devolve o saldo dado um email
module.exports.getSaldo = email => {
    return User
    .findOne({email: email}, {_id:0, saldo: 1})
    .exec()
}

// Retira Saldo
module.exports.retiraSaldo = async (email, valorGasto) => {

    var saldo = await this.getSaldo(email)
    
    if (valorGasto <= saldo) {
        return User
        .findOneAndUpdate({email: email},{$inc: {saldo: -valorGasto}})
        .exec()
    }
    else throw new Error ("Saldo insuficiente")
}

// Aumenta Saldo
module.exports.aumentaSaldo = (email, valor) => {
    return User
    .findOneAndUpdate({email: email},{$inc: {saldo: valor}})
    .exec()
}

module.exports.inserir = (novo) => {
    return User.create(novo)
}

