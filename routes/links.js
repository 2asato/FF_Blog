var express = require('express'),
    router = express.Router(),
    Link = require('../models/link'),
    middleware = require('../middleware')



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
router.get('/links/new', middleware.isSignedIn, function(req, res){
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

// links edit route
router.get('/links/:link_id/edit', middleware.checkLinkOwnership, function(req, res) {
    Link.findById(req.params.link_id, function(err, foundLink) {
        if(err) {
            res.redirect('/links')
        } else {
            res.render('links/edit', { link: foundLink })
        }
    })
})

// links update route
router.put("/links/:link_id", middleware.checkLinkOwnership, function(req, res) {
    Link.findByIdAndUpdate(req.params.link_id, req.body.link, function(err, updatedLink) {
        if(err){
            req.flash('failure', 'Something went wrong, please try again')
            res.redirect('/links')
        } else {
            req.flash('success', 'Link edited')

            res.redirect('/links');
        }
    })
});


// links destroy route
router.delete('/links/:link_id', middleware.checkLinkOwnership, function(req, res){
    Link.findByIdAndRemove(req.params.link_id, function(err){
        if(err){
            res.redirect('back')
        } else {
            req.flash('success', 'Link deleted')
            res.redirect('/links')
        }
    })
})

module.exports = router;
