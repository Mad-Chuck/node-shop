var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var Product = require('../models/product');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
    // will also accept empty string
    if(typeof (req.query.search) !== 'undefined') {
        const searchQuery = new RegExp(req.query.search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi');
        res.cookie('searchQuery', req.query.search);

        Product.find({$or:[
                {"title": searchQuery},
                {"description": searchQuery}
        ]}, function(err, docs) {
            res.render('index', {
                title: 'Shop',
                products: docs,
                searchDone: true,
                hasSearchResults: docs.length > 0,
                csrfToken: req.csrfToken(),
                //"save cookie to locals before sending res"
                searchQuery: req.query.search
            });
        });
    } else {
        Product.find(function(err, docs) {
            res.render('index', {
                title: 'Shop',
                products: docs,
                csrfToken: req.csrfToken()
            });
        });
    }
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
