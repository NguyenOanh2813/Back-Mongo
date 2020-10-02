const mongoose = require('mongoose')

const Schema = mongoose.Schema
const testScoreSchema = new Schema({
    clusterName: String,
    locationName: String,
    subject: String,
    creatAt: Date
})

module.exports = mongoose.model('Test-Score',testScoreSchema, 'Test-Scores')