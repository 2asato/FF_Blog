// app config
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    Post = require('./models/post'),
    Link = require('./models/link'),
    seedDB = require('./seeds');

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

// landing page
app.get('/', function(req, res){
    res.redirect('/posts');
})

// index route
app.get('/posts', function(req, res){
    Post.find({}, function(err, posts){
        if(err){
            console.log('ERRORRRRR!!!!');
            
        } else {
            res.render('index', { posts: posts });
        }
    })
})

// new route
app.get('/posts/new', function(req, res){
    res.render('new')
})

// create route
app.post('/posts', function(req, res){
    req.body.post.body = req.sanitize(req.body.post.body);
    Post.create(req.body.post, function(err, newPost){
        if(err){
            res.render('new');
        } else {
            res.redirect('/posts')
        }
    })
})

// show route
app.get('/posts/:id', function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            res.redirect('/posts')
        } else {
            res.render('show', { post: foundPost })
        }
    })
})

// edit route
app.get('/posts/:id/edit', function(req, res) {
    Post.findById(req.params.id, function(err, foundPost) {
        if(err) {
            res.redirect('/posts')
        } else {
            res.render('edit', { post: foundPost })
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

// links route
app.get('/links', function(req, res) {
    Link.find({}, function(err, links){
        if(err){
            console.log('ERRORRRRR!!!!');
            
        } else {
            res.render('links', { links: links });
        }
    })
})

// new links route
app.get('/links/new', function(req, res){
    res.render('newLinks')
})

// create links route
app.post('/links', function(req, res){
    req.body.link.body = req.sanitize(req.body.link.body);
    Link.create(req.body.link, function(err, newLink){
        if(err){
            res.render('newLink');
        } else {
            res.redirect('/links')
        }
    })
})









// connect to server
app.listen(5000, function(){
    console.log('FF Blog server has started on port 5000');
    
})

