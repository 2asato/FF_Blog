// app config
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Post = require('./models/post'),
    Link = require('./models/link'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds')

var postRoutes = require('./routes/posts'),
    commentRoutes = require('./routes/comments'),
    linkRoutes = require('./routes/links'),
    authRoutes = require('./routes/index')

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
app.use(flash());

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
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use(postRoutes);
app.use(commentRoutes);
app.use(linkRoutes);
app.use(authRoutes);


// connect to server
// app.listen(5000, function(){
//     console.log('FF Blog server has started on port 5000');
    
// })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

