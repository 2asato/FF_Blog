var mongoose = require('mongoose');

// schema
var postSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    created: { type: Date, default: Date.now }

});

// model
module.exports = mongoose.model('Post', postSchema);
