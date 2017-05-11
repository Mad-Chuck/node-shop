var express = require('express');
var router = express.Router();
var csrf = require('csurf')
var Product = require('../models/product');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/:url', function(req, res, next) {
    var productUrl = req.params.url;

    //validation could be done better probably
    if (productUrl.match(/[-0-9a-zA-Z]\w+/)) {
        Product.findOne({ 'url': productUrl }, function(err, product) {
            if (err) {
                throw err;
                return res.redirect('/');
            }
            res.render('product', {
                title: product.title,
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

module.exports = router;