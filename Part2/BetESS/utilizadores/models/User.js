var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    email: {type:String, unique:true},
    password: String,
    saldo: Number
});


UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {return next()};
    bcrypt.hash(user.password, 10).then((hashedPassword) => {
        user.password = hashedPassword;
        next();
    })
}, function (err) {
    next(err)
})

UserSchema.methods.isValidPassword = async function(password) {
    var user = this
    var compare = await bcrypt.compare(password, user.password)
    return compare
}

module.exports = mongoose.model("User", UserSchema, "utilizadores");
