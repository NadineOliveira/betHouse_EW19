var User = require('../models/User')
var bcrypt = require('bcrypt')

// Lista de utilizadores
module.exports.list = () => {
    return User
        .find({},{password: false})
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

    var user = await this.getSaldo(email)
    if (valorGasto <= user.saldo) {
        var newSaldo = user.saldo - valorGasto
        return User
        .findOneAndUpdate({email: email},{saldo: newSaldo})
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

// Update Premium
module.exports.updatePremium = (email, premium) => {
    return User
    .findOneAndUpdate({email: email},{premium: premium})
    .exec()
}

// Update Admin
module.exports.updateAdmin = (email, admin) => {
    return User
    .findOneAndUpdate({email: email},{admin: admin})
    .exec()
}

module.exports.inserir = (novo) => {
    return User.create(novo)
}

