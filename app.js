// app config
var express = require('express'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose')

// config mongoose
mongoose.connect('mongodb://localhost/ff_blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}))

// schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
})

// model
var Blog = mongoose.model('Blog', blogSchema);

// index route
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log('ERRORRRRR!!!!');
            
        } else {
            res.render('index', { blogs: blogs })
        }
    })
})

// new route
app.get('/blogs/new', function(req, res){
    res.render('new')
})

// create route
app.post('/blogs', function(req, res){
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
app.get('/blogs/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs')
        } else {
            res.send('edit page')
        }
    })
})









// connect to server
app.listen(5000, function(){
    console.log('FF Blog server has started on port 5000');
    
})

