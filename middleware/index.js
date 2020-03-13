var Post = require('../models/post'),
    Comment = require('../models/comment'),
    middlewareObj = {};

// MIDDLEWARE

// checks if user is signed in
middlewareObj.isSignedIn = 
function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/signin');
}

// checks if user/post are associated
middlewareObj.checkPostOwnership =
function checkPostOwnership(req, res, next){
    if(req.isAuthenticated()){
        Post.findById(req.params.id, function(err, foundPost){
            // checks for error and foundPost with exact parameters
            if(err || !foundPost){
                req.flash('error', 'Post not found')
                res.redirect('back')
            } else {
                if(foundPost.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'You do not have permission to do that')
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You need to be logged in to do that')
        res.redirect('back');
    }
}

// checks if user/comments are associated
middlewareObj.checkCommentOwnership =
function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            // checks for error and comment with exact parameters
            if(err || !foundComment){
                req.flash('error', 'Comment not found')
                res.redirect('back')
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'You do not have permission to do that')
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You need to be logged in to do that')
        res.redirect('back');
    }
}



module.exports = middlewareObj