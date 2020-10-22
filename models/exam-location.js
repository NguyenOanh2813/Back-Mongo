const mongoose = require('mongoose')

const Schema = mongoose.Schema
const examLocationSchema = new Schema({
    exam_cluster_id: String,
    exam_cluster_name: String,
    exam_location_id: String,
    location: String,
    address: String,
    exam_room_number: Number,
    limit_student: Number
})

module.exports = mongoose.model('exam_location', examLocationSchema, 'exam_locations')