var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

router.post('/register', isNotLoggedIn, function(req, res, next) {
    req.checkBody('email').notEmpty();
    req.checkBody('password').notEmpty();
    var errors = req.validationErrors();
    if (errors){
        req.flash('registerErrors', 'You can\'t leave fields empty.');
        res.redirect('/');
    } else {
        passport.authenticate('local.register', {
            successRedirect: '/',
            failureRedirect: 'back',
            failureFlash: false
        })(req,res,next);
    }
});

router.post('/login', isNotLoggedIn, function(req, res, next) {
    req.checkBody('email').notEmpty();
    req.checkBody('password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        req.flash('loginErrors', 'Insert proper data.');
        res.redirect('/');
    } else {
        passport.authenticate('local.login', {
            successRedirect: '/',
            failureRedirect: 'back',
            failureFlash: false
        })(req,res,next);
    }
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

router.get('/logout', isLoggedIn, function(req, res, next) {
    req.logout();
    res.redirect('/');
});

module.exports = router;