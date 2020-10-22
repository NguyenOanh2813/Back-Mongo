const mongoose = require('mongoose')

const Schema = mongoose.Schema
const timeLineSchema = new Schema({
    subject: String,
    date: Date,
    exam_shift: Number
})

module.exports = mongoose.model('time_line',timeLineSchema, 'time_lines')