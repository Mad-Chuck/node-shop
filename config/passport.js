var passport = require('passport');
var User = require('../models/users');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
   done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local.register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Insert proper E-Mail address.').isEmail();
    req.checkBody('password', 'Password has to be at least 5 characters long.').isLength({ min: 5 });
    var errors = req.validationErrors();
    if (errors){
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('registerErrors', messages));
    }
    User.findOne({ 'email': email }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, req.flash('registerErrors', 'E-Mail is already in use.'));
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));


passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid email.').isEmail();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('loginErrors', messages));
    }
    User.findOne({ 'email': email }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, req.flash('loginErrors', 'Wrong E-Mail.'));
        }
        if (!user.validPassword(password)) {
            return done(null, false, req.flash('loginErrors', 'Wrong password'));
        }
        return done(null, user)
    });
}));
