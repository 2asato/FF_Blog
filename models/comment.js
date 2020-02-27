var mongoose = require('mongoose');

// schema
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    added: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Comment', commentSchema);