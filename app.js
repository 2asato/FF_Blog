// app config
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Post = require('./models/post'),
    Link = require('./models/link'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds')

seedDB();

// config mongoose
mongoose.connect('mongodb://localhost/ff_blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

// config passport
app.use(require('express-session')({
    secret: 'Leo loves Buster the bus',
    resave: false,
    saveUninitialized: false 
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use currentUser on all pages
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

// landing page
app.get('/', function(req, res){
    res.redirect('/posts');
})


// ==================
// BLOG POSTS
// ==================

// index route
app.get('/posts', function(req, res){
    Post.find({}, function(err, posts){
        if(err){
            console.log('ERRORRRRR!!!!');
            
        } else {
            res.render('posts/index', { posts: posts });
        }
    })
})

// create route
app.post('/posts', isSignedIn, function(req, res){
    
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
            
            res.redirect('/posts')
        }
    })
})

// new route
app.get('/posts/new', isSignedIn, function(req, res){
    res.render('posts/new')
})



// show route
app.get('/posts/:id', function(req, res){
    Post.findById(req.params.id).populate('comments').exec(function(err, foundPost){
        if(err){
            console.log(err);
            res.redirect('/posts')
        } else {
            console.log(foundPost);
            res.render('posts/show', { post: foundPost })
        }
    })
})

// edit route
app.get('/posts/:id/edit', checkPostOwnership, function(req, res) {
    Post.findById(req.params.id, function(err, foundPost) {
        if(err) {
            res.redirect('/posts')
        } else {
            res.render('posts/edit', { post: foundPost })
        }
    })
})

// update route
app.put("/posts/:id", checkPostOwnership, function(req, res) {
    req.body.post.body = req.sanitize(req.body.post.body);
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost) {
        if(err){
            res.redirect('/posts')
        } else {
            res.redirect('/posts/' + req.params.id);
        }
    })
});

// delete route
app.delete('/posts/:id', checkPostOwnership, function(req, res) {
    Post.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect('/posts')
        } else {
            res.redirect('/posts')
        }
    })
})


// ========================
// LINKS
// ========================

// links route
app.get('/links', function(req, res) {
    Link.find({}, function(err, links){
        if(err){
            console.log('ERRORRRRR!!!!');
            
        } else {
            res.render('links/show', { links: links });
        }
    })
})

// new links route
app.get('/links/new', isSignedIn, function(req, res){
    res.render('links/new')
})

// create links route
app.post('/links', function(req, res){
    req.body.link.body = req.sanitize(req.body.link.body);
    Link.create(req.body.link, function(err, newLink){
        if(err){
            res.render('links/new');
        } else {
            res.redirect('/links')
        }
    })
})


// ================
// COMMENTS
// ================

// new comment route
app.get('/posts/:id/comments/new', isSignedIn, function(req, res){
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
app.post('/posts/:id/comments', isSignedIn, function(req, res){
    // lookup posts
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
            res.redirect('/posts')
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    // connect new comment to posts
                    post.comments.push(comment);
                    post.save();
                    // redirect to posts show page
                    res.redirect('/posts/' + post._id);
                }
            })
        }
    })
})

// comments edit route
app.get('/posts/:id/comments/:comment_id/edit', function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect('back')
        } else {
            res.render('comments/edit', { post_id: req.params.id, comment: foundComment })
        }
    })
})

// comments update route
app.put('/posts/:id/comments/:comment_id', function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back') 
        } else {
            res.redirect('/posts/' + req.params.id);
        }
    })
})

// comment destroy route
app.delete('/posts/:id/comments/:comment_id', function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back')
        } else {
            res.redirect('/posts/' + req.params.id)
        }
    })
})


// =============
// AUTH ROUTES
// =============

// show signup form
app.get('/signup', function(req, res){
    res.render('signup');
})

// handle signup logic
app.post('/signup', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('signup')
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/posts')
        })
    })
})

// show sign in form
app.get('/signin', function(req, res){
    res.render('signin')
})

// handle sign in logic
app.post('/signin', passport.authenticate('local',
    {
        successRedirect: '/posts',
        failureRedirect: '/signup'
    }), function(req, res){
})

// sign out route
app.get('/signout', function(req, res){
    req.logOut();
    res.redirect('/posts');
})

// middleware
// checks if user is signed in
function isSignedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/signin');
}

// checks if user/post are associated
function checkPostOwnership(req, res, next){
    if(req.isAuthenticated()){
        Post.findById(req.params.id, function(err, foundPost){
            if(err){
                res.redirect('back')
            } else {
                if(foundPost.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}






// connect to server
app.listen(5000, function(){
    console.log('FF Blog server has started on port 5000');
    
})

