var mongoose = require('mongoose');

// schema
var postSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
})

// model
module.exports = mongoose.model('Post', postSchema);