const mongoose = require('mongoose')

const Schema = mongoose.Schema
const postSchema = new Schema({
    uniID: String,
    facultyName: String,
    majorName: String,
    content: String,
    date_posted: String
})

module.exports = mongoose.model('Post', postSchema, 'Posts')
