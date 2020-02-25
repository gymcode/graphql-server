const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name: {
        type: String,
        required: true 
    }, 
    genre: {
        type: String, 
        required: true
    }, 
    authorid: {
        type: String
    }
})

module.exports = mongoose.model('Books', bookSchema)