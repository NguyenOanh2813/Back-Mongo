const mongoose = require('mongoose')

const Schema = mongoose.Schema
const universitySchema = new Schema({
    university_id: String,
    university_code: String,
    university_name: String, 
    department: Array,
    image_url: String,
    info: String,
    logo: String
})

module.exports = mongoose.model('university', universitySchema, 'universities')
