var mongoose = require('mongoose');

// schema
var linkSchema = new mongoose.Schema({
    name: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    site: String,
    description: String,
    image: String,
    added: { type: Date, default: Date.now }
});

// link model
module.exports = mongoose.model('Link', linkSchema);



