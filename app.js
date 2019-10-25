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











// connect to server
app.listen(5000, function(){
    console.log('FF Blog server has started on port 5000');
    
})