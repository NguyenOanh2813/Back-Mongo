const mongoose = require('mongoose')

const Schema = mongoose.Schema
const examLocationSchema = new Schema({
    locationID: String,
    clusterName: String,
    locationName: String,
    address: String,
    room: Number
})

module.exports = mongoose.model('Exam-Location', examLocationSchema, 'Exam-Locations')