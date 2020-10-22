const mongoose = require('mongoose')

const Schema = mongoose.Schema
const examSchema = new Schema({
    exam_id: String,
    exam_name: String,
    start_date: Date,
    end_date: Date,
    time_shift_1: Date,
    time_shift_2: Date,
    time_shift_3: Date,
    time_shift_4: Date
})

module.exports = mongoose.model('exam',examSchema, 'exams')