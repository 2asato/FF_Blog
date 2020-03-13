var express = require('express'),
    router = express.Router();

// ==================
// BLOG POSTS
// ==================

// index routrouter.get('/posts', function(req, res){
    Post.find({}, function(err, posts){
        if(err){
            console.log('ERRORRRRR!!!!');
            
        } else {
            res.render('posts/index', { posts: posts });
        }
    })

// create route
router.post('/posts', isSignedIn, function(req, res){
    
    req.body.post.body = req.sanitize(req.body.post.body);    
    Post.create(req.body.post, function(err, newPost){
        if(err){
            res.render('posts/new');
        } else {   
            // add username and id to post
            // console.log('New post username will be : ' + req.user.username);
            newPost.author.username = req.user.username;
            newPost.author.id = req.user._id;
            // save post
            newPost.save();
            console.log(newPost);
            req.flash('success', 'Post created')

            res.redirect('/posts')
        }
    })
})

// new route
router.get('/posts/new', isSignedIn, function(req, res){
    res.render('posts/new')
})



// show route
router.get('/posts/:id', function(req, res){
    Post.findById(req.params.id).populate('comments likes').exec(function(err, foundPost){
        // checks for error and post with exact parameters
        if(err || !foundPost){
            req.flash('error', 'Post not found')
            res.redirect('/posts')
        } else {
            console.log(foundPost);
            res.render('posts/show', { post: foundPost })
        }
    })
})

// edit route
router.get('/posts/:id/edit', checkPostOwnership, function(req, res) {
    Post.findById(req.params.id, function(err, foundPost) {
        if(err) {
            res.redirect('/posts')
        } else {
            res.render('posts/edit', { post: foundPost })
        }
    })
})

// update route
router.put("/posts/:id", checkPostOwnership, function(req, res) {
    req.body.post.body = req.sanitize(req.body.post.body);
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost) {
        if(err){
            res.redirect('/posts')
        } else {
            req.flash('success', 'Post edited')

            res.redirect('/posts/' + req.params.id);
        }
    })
});

// delete route
router.delete('/posts/:id', checkPostOwnership, function(req, res) {
    Post.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect('/posts')
        } else {
            req.flash('success', 'Post deleted')
            res.redirect('/posts')
        }
    })
})

// Post Like Route
router.post('/posts/:id/like', isSignedIn, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
            return res.redirect('/posts');
        }
        // check if user id exists in foundPost.likes
        var foundUserLike = foundPost.likes.some(function(like){
            return like.equals(req.user._id);
        });
        if(foundUserLike){
            // user already liked, remove like
            foundPost.likes.pull(req.user._id)
        } else {
            // adding new user like
            foundPost.likes.push(req.user);
        }
        foundPost.save(function(err){
            if(err){
                console.log(err);
                return res.redirect('/posts');
            }
            return res.redirect('/posts/' + foundPost._id);
        })
    })
})

module.exports = router;
