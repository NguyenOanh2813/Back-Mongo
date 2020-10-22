const mongoose = require('mongoose')

const Schema = mongoose.Schema
const examClusterSchema = new Schema({
    exam_cluster_id: String,
    exam_cluster_name: String
})

module.exports = mongoose.model('exam_cluster', examClusterSchema, 'exam_clusters')