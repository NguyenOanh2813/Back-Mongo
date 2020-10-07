const mongoose = require('mongoose')

const Schema = mongoose.Schema
const universitySchema = new Schema({
    universityName: String
})

module.exports = mongoose.model('University', universitySchema, 'Universitys')
