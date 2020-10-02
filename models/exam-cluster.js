const mongoose = require('mongoose')

const Schema = mongoose.Schema
const examClusterSchema = new Schema({
    clusterID: String,
    clusterName: String
})

module.exports = mongoose.model('Exam-Cluster', examClusterSchema, 'Exam-Clusters')