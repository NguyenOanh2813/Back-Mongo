const mongoose = require('mongoose')

const Schema = mongoose.Schema
const majorSchema = new Schema({
    university: String,
    facultyName: String,
    majorName: String,
    majorID: String
})

module.exports = mongoose.model('Major', majorSchema, 'Majors')
