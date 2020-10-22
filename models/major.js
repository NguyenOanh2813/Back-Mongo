const mongoose = require('mongoose')

const Schema = mongoose.Schema
const majorSchema = new Schema({
    university_id: String,
    department_name: String,
    department_id: String,
    major_name: String,
    major_id: String,
    combination: String,
    info: String,
    degree: String,
    training_time: String
})

module.exports = mongoose.model('major', majorSchema, 'majors')