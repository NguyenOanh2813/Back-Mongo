const mongoose = require('mongoose')

const Schema = mongoose.Schema
const majorSchema = new Schema({
    uniID: String,
    falID: String,
    majorName: String,
    majorID: String
})

module.exports = mongoose.model('Major', majorSchema, 'Majors')
