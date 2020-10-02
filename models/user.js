const mongoose = require('mongoose')

const Schema = mongoose.Schema
const userSchema = new Schema({
    email: String,
    userName: String,
    password: String
})

module.exports = mongoose.model('User', userSchema, 'Users')
