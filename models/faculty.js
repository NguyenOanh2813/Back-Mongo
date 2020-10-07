const mongoose = require('mongoose')

const Schema = mongoose.Schema
const faculySchema = new Schema({
    uniID: String,
    facultyName: String,
    facultyID: String
})

module.exports = mongoose.model('Faculty', faculySchema, 'Facultys')
