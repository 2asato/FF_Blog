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
app.post('/posts', function(req, res){
    req.body.post.body = req.sanitize(req.body.post.body);
    Post.create(req.body.post, function(err, newPost){
        if(err){
            res.render('posts/new');
        } else {
            res.redirect('/posts')
        }
    })
})

// new route
app.get('/posts/new', function(req, res){
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
app.get('/posts/:id/edit', function(req, res) {
    Post.findById(req.params.id, function(err, foundPost) {
        if(err) {
            res.redirect('/posts')
        } else {
            res.render('posts/edit', { post: foundPost })
        }
    })
})

// update route
app.put("/posts/:id", function(req, res) {
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
app.delete('/posts/:id', function(req, res) {
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
app.get('/links/new', function(req, res){
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
app.get('/posts/:id/comments/new', function(req, res){
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
app.post('/posts/:id/comments', function(req, res){
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

// show login form
app.get('/signin', function(req, res){
    res.render('signin')
})







// connect to server
app.listen(5000, function(){
    console.log('FF Blog server has started on port 5000');
    
})

