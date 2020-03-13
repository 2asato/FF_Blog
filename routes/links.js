var express = require('express'),
    router = express.Router();


// ========================
// LINKS
// ========================

// links route
router.get('/links', function(req, res) {
    Link.find({}, function(err, links){
        if(err){
            console.log('ERRORRRRR!!!!');
            
        } else {
            res.render('links/show', { links: links });
        }
    })
})

// new links route
router.get('/links/new', isSignedIn, function(req, res){
    res.render('links/new')
})

// create links route
router.post('/links', function(req, res){
    req.body.link.body = req.sanitize(req.body.link.body);
    Link.create(req.body.link, function(err, newLink){
        if(err){
            res.render('links/new');
        } else {
            req.flash('success', 'New Link Succesfully Created')
            res.redirect('/links')
        }
    })
})

module.exports = router;
