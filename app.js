var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var shoppingCart = require('./routes/shopping-cart');
var user = require('./routes/user');
var product = require('./routes/product');

var app = express();

/* admin variables */
var databaseName = 'test';
var secretKey = 'secretKey';
/* end of admin variables */

mongoose.connect('127.0.0.1:27017/'+databaseName);

require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
    //                min * sec * ms
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals.isLogged = req.isAuthenticated();
    res.locals.session = req.session;
    res.locals.registerErrors = req.flash('registerErrors');
    res.locals.hasRegisterErrors = res.locals.registerErrors.length > 0;
    res.locals.loginErrors = req.flash('loginErrors');
    res.locals.hasLoginErrors =  res.locals.loginErrors.length > 0;
    res.locals.cartSuccess = req.flash('cartSuccess');
    res.locals.hasCartSuccess = res.locals.cartSuccess.length > 0;
    res.locals.cartErrors = req.flash('cartErrors');
    res.locals.hasCartErrors = res.locals.cartErrors.length > 0;
    res.locals.searchQuery = req.cookies.searchQuery || '';
    next();
});

app.use('/', index);
app.use('/shopping-cart', shoppingCart);
app.use('/user', user);
app.use('/product', product);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
