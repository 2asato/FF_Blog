// app config
var express = require('express'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
methodOverride = require('method-override'),
expressSanitizer = require('express-sanitizer')

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

// schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
})

var linkSchema = new mongoose.Schema({
    name: String,
    site: String,
    description: String,
    image: String,
    added: { type: Date, default: Date.now }
})

// model
var Blog = mongoose.model('Blog', blogSchema);
var Link = mongoose.model('Link', linkSchema);


app.get('/', function(req, res){
    res.redirect('/blogs');
})

// index route
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log('ERRORRRRR!!!!');
            
        } else {
            res.render('index', { blogs: blogs });
        }
    })
})

// new route
app.get('/blogs/new', function(req, res){
    res.render('new')
})

// create route
app.post('/blogs', function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new');
        } else {
            res.redirect('/blogs')
        }
    })
})

// show route
app.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs')
        } else {
            res.render('show', { blog: foundBlog })
        }
    })
})

// edit route
app.get('/blogs/:id/edit', function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect('/blogs')
        } else {
            res.render('edit', { blog: foundBlog })
        }
    })
})

// update route
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if(err){
            res.redirect('/blogs')
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    })
});

// delete route
app.delete('/blogs/:id', function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect('/blogs')
        } else {
            res.redirect('/blogs')
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

