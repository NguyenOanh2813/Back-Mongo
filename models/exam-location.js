const mongoose = require('mongoose')

const Schema = mongoose.Schema
const examLocationSchema = new Schema({
    cltID: String,
    locationName: String,
    locationID: String,
    address: String,
    room: Number
})

module.exports = mongoose.model('Exam-Location', examLocationSchema, 'Exam-Locations')