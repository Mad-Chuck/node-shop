var mongoose = require('mongoose');
var Product = require('../models/product');

var databaseName = "test";
mongoose.connect('localhost:27017/'+databaseName);

var products = [
    new Product({
        title: 'PPP Pencase White',
        description: 'Biały piórnik Portalu Polskich Penspinnerów.\nCzarna wkładka, rozstaw gumek 8cm.\nSprzedawany bez długopisów widocznych na zdjęciu.',
        imagePath: 'http://pensfactory.pl/upload/images/products/big/PPP_Pencase_White7578.jpg',
        price: 35
    }),
    new Product({
        title: 'Buster Cyl Classic White',
        description: 'Jedna z najbardziej popularnych modyfikacji na świecie. Rozpowszechniona przez penspinnera o nicku Spinnerpeem, który w 2009 roku zdobył mistrzostwo świata. Duże momentum i grube body sprawia, że tą modyfikacją kręci się bardzo łatwo i przyjemnie. Podwójny bardzo przyczepny grip pomaga wykonywać wszelkie ewolucje z rodziny infinity.\nZastosowano cięższe tipy Airfita.',
        imagePath: 'http://pensfactory.pl/upload/images/products/big/Buster_Cyl_Classic_White1749.jpg',
        price: 55
    }),
    new Product({
        title: 'Airfit Bp Tip [Heavy]',
        description: 'Airfit Tip from Ballpoint Pen for modding. Heavy version.',
        imagePath: 'http://pensfactory.pl/upload/images/products/big/Airfit_Bp_Tip_Heavy_5391.jpg',
        price: 9.50
    })
];

var done = 0;
for (var i = 0; i < products.length; i++){
    products[i].save(function(err, result){
        done++;
        if (done === products.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}