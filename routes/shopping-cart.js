var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var Product = require('../models/product');
var passport = require('passport');

var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/add', function(req, res, next) {
    var productId = req.query.productId;
    var qty = req.query.qty || 1;

    var cart = new Cart(req.session.cart ? req.session.cart : {});

    if (productId.match(/^[0-9a-fA-F]{24}$/) && qty % 1 === 0 && qty >= 0) {
        Product.findById(productId, function(err, product) {
            if (err) {
                throw err;
                return res.redirect('/');
            }
            console.log(productId, qty);
            cart.add(product, product.id, +qty);
            req.session.cart = cart;
            //console.log(req.session.cart);
            res.redirect('back');
        })
    } else {
        //console.log('Somebody is putting wrong data to /add-to-cart post route')
        res.redirect('back');
    }
});

router.get('/remove/:id', function(req, res, next) {
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

router.post('/update', function(req, res, next) {
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

module.exports = router;