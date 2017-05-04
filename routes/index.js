var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var Product = require('../models/product');
var passport = require('passport');

var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

router.post('/update-cart', function(req, res, next) {
    //"id" : "qty" object
    var data = req.body;

    //create new cart from session
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    //check if there are no undesirable data (like _csrf) and update cart
    var dataCount= Object.keys(data).length;
    var updated = false;
    var productId, i;
    for (i = 0; i < dataCount; i++){
        productId = Object.keys(data)[i];
        if (productId.match(/^[0-9a-fA-F]{24}$/) && typeof cart.items[productId] !== 'undefined' && !(data[productId] === cart.items[productId].qty) && data[productId] % 1 === 0 && data[productId] >= 0){
            cart.changeQty(productId, data[productId]);
            updated = true;
        }
    }

    //if there were changes
    if (updated === true)
    {
        req.session.cart = cart;
        req.flash('cartSuccess', 'Cart has been updated');
        res.redirect('back');
    } else {
        req.flash('cartSuccess', 'Nothing needs to be updated');
        res.redirect('back');
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
    //unnecessary function, to be changed
    Product.find(function(err, docs) {
        res.render('index', {
            title: 'Shop',
            products: docs,
            // not sure, if same csrf should be used to both login and register
            csrfToken: req.csrfToken()
        });
    });
});

router.get('/product/:url', function(req, res, next) {
    var productUrl = req.params.url;

    //validation could be done better probably
    if (productUrl.match(/[-0-9a-zA-Z]\w+/)) {
        Product.findOne({ 'url': productUrl }, function(err, product) {
            if (err) {
                throw err;
                return res.redirect('/');
            }
            res.render('product', {
                product: product,
                csrfToken: req.csrfToken()
            })
        })
    } else {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
});

router.get('/checkout', function(req, res, next) {
    if  (req.session.cart.totalPrice > 0) {
        res.render('checkout', {
            title: 'Shop',
            // not sure, if same csrf should be used to both login and register
            csrfToken: req.csrfToken()
        });
    } else {
        req.flash('cartErrors', 'You can\'t buy nothing.');
        res.redirect('back');
    }
});



router.get('/add-to-cart/:id', function(req, res, next) {
   var productId = req.params.id;
   var cart = new Cart(req.session.cart ? req.session.cart : {});


    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
        Product.findById(productId, function(err, product) {
            if (err) {
                throw err;
                return res.redirect('/');
            }
            cart.add(product, product.id);
            req.session.cart = cart;
            //console.log(req.session.cart);
            res.redirect('back');
        })
    } else {
        //console.log('Somebody is putting wrong data to /add-to-cart get route')
        res.redirect('back');
    }
});

router.get('/remove-from-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    //there is no need to check if it is id, because in cart.items can only be id
    if (typeof cart.items[productId] !== 'undefined'){
        cart.remove(productId);
        req.session.cart = cart;
        //console.log(req.session.cart);
        req.flash('cartSuccess', 'Product has been deleted.');
        res.redirect('back');
    } else {
        //console.log("Somebody is putting wrong data to /remove-from-cart get route");
        res.redirect('back');
    }
});

/*router.get('/change-qty/:id/:qty', function(req, res, next) {
    var productId = req.params.id;
    var qty = req.params.qty;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product) {
        if (err) {
            throw err;
            return res.redirect('/');
        }
        cart.changeQty(product.id, qty);
        req.session.cart = cart;
        console.log(req.session.cart);
        req.flash('cartSuccess', 'Cart has been updated');
        res.redirect('back');
    })
});*/

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
