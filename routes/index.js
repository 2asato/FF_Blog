var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user')


// landing page
router.get('/', function(req, res){
    res.redirect('/posts');
})


// =============
// AUTH ROUTES
// =============

// show signup form
router.get('/signup', function(req, res){
    res.render('signup');
})

// handle signup logic
router.post('/signup', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message);

            return res.redirect('signup');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'Welcome to FF Blog ' + user.username);
            res.redirect('/posts');
        })
    })
})

// show sign in form
router.get('/signin', function(req, res){
    res.render('signin')
})

// handle sign in logic
router.post('/signin', passport.authenticate('local',
    {
        successFlash:   'Welcome back',
        successRedirect: '/posts',
        failureRedirect: '/signup',
        failureFlash: 'Please sign up!'
    }), function(req, res){

})

// sign out route
router.get('/signout', function(req, res){
    req.logOut();
    req.flash('success', 'Logged you out');
    res.redirect('/posts');
})

module.exports = router;