var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var Product = require('../models/product');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
    //unnecessary function, to be changed
    Product.find(function(err, docs) {
        res.render('index', {
            title: 'Shop',
            products: docs,
            csrfToken: req.csrfToken()
        });
    });
});

router.get('/checkout', function(req, res, next) {
    if  (req.session.cart.totalPrice > 0) {
        res.render('checkout', {
            title: 'Shop',
            csrfToken: req.csrfToken()
        });
    } else {
        req.flash('cartErrors', 'You can\'t buy nothing.');
        res.redirect('back');
    }
});

module.exports = router;
