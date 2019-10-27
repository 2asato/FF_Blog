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
app.get('/posts', function(req, res){
    res.render('index')
})

// new route
app.get('/posts/new', function(req, res){
    res.render('new')
})











// connect to server
app.listen(5000, function(){
    console.log('FF Blog server has started on port 5000');
    
})