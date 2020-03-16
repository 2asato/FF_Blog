var mongoose = require('mongoose'),
    Post = require('./models/post'),
    Comment = require('./models/comment')

// seed data
var data = [
    {
        title: 'AFC Champions',
        image: 'http://allvectorlogo.com/img/2016/03/american-football-conference-afc-logo.png',
        body: 'Kansas City Chiefs',
        author: {
            username: 'aaron',
            id: '5e50282c0ecbb8de9ce7a569'
        }
        // created: { type: Date, default: Date.now }
    
    },
    {
        title: 'NFC Champions',
        image: 'https://www.logolynx.com/images/logolynx/3e/3ecf1483d152d45258177297349af25a.jpeg',
        body: 'San Francisco 49ers',
        author: {
            username: 'aaron',
            id: '5e50282c0ecbb8de9ce7a569'
        }
        // created: { type: Date, default: Date.now }
    },
    {
        title: 'Super Bowl LIV',
        image: 'data:image/jpeg;base64,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',
        body:'Super Bowl LIV, Kansas City Chiefs (15 - 3) vs. San Francisco 49ers (14 - 4), February 2, 2020, 3:30 pm, Watch on FOX',
        author: {
            username: 'aaron',
            id: '5e50282c0ecbb8de9ce7a569'
        }
        // created: { type: Date, default: Date.now}
    }
]


function seedDB(){
    // Remove all posts
    Post.deleteMany({}, function(err){
        if(err){
            console.log(err);
            
        }
        console.log('removed posts!');
        data.forEach(function(seed){
            Post.create(seed, function(err, post){
                if(err){
                    console.log(err);
                    
                } else {
                    console.log('added a post');
                    // create a comment
                    // Comment.create(
                    //     {
                    //         text: 'FOOTBALL RULES!!!',
                    //         author: 'Odoyle',
                    //     }, function(err, comment){
                    //         if(err){
                    //             console.log(err);
                            
                    //         } else {
                    //             post.comments.push(comment);
                    //             post.save();
                    //             console.log('Created new comment');
                            
                    //     }
                    // })
                }
            })
        })
        
    // })
}

module.exports = seedDB;