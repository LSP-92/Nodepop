'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Definimos el esquema
const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  passwd: { type: String }

})

userSchema.statics.hashPasswd = function (passwd) {
    return bcrypt.hash(passwd, 12)    
}

userSchema.methods.checkPasswd = function (user) {
    return bcrypt.compare(user.passwd, this.passwd)    
}

const User = mongoose.model('User', userSchema)

module.exports = User