const mongoose = require('mongoose')

const Schema = mongoose.Schema
const combinationSchema = new Schema({
    combination_id: String,
    subjects: [{
        subj_1: String,
        subj_2: String,
        subj_3: String
    }]
})

module.exports = mongoose.model('combination', combinationSchema, 'combinations')