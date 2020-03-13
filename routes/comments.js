var express = require('express'),
    router = express.Router(),
    Post = require('../models/post'),
    Comment = require('../models/comment'),
    middleware = require('../middleware')



// ================
// COMMENTS
// ================

// new comment route
router.get('/posts/:id/comments/new', middleware.isSignedIn, function(req, res){
    // find post by id
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
            
        } else {
            res.render('comments/new', {post: post});
        }
    })
})

// create comment route
router.post('/posts/:id/comments', middleware.isSignedIn, function(req, res){
    // lookup posts
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
            res.redirect('/posts')
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash('error', 'Something went wrong')

                    console.log(err);
                    
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    // connect new comment to posts
                    post.comments.push(comment);
                    post.save();
                    req.flash('success', 'Successfully added comment')

                    // redirect to posts show page
                    res.redirect('/posts/' + post._id);
                }
            })
        }
    })
})

// comments edit route
router.get('/posts/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err || !foundPost){
            req.flash('error', 'No post found')
            return res.redirect('back');
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect('back')
            } else {
                res.render('comments/edit', { post_id: req.params.id, comment: foundComment })
            }
        })
    })
})

// comments update route
router.put('/posts/:id/comments/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back') 
        } else {
            res.redirect('/posts/' + req.params.id);
        }
    })
})

// comment destroy route
router.delete('/posts/:id/comments/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back')
        } else {
            req.flash('success', 'Comment deleted')
            res.redirect('/posts/' + req.params.id)
        }
    })
})



module.exports = router
