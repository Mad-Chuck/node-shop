module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, price: 0 }
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    this.remove = function(item, id) {
        var storedItem = this.items[id];
        //maybe unnecessary if
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, price: 0 }
        }
        this.totalQty -= storedItem.qty;
        this.totalPrice -= storedItem.item.price * storedItem.qty;
/*        storedItem.qty = 0;
        storedItem.price = 0;
        this.items[id] = null;*/
        delete this.items[id];
    };


    //works with no such item in basket (probably)
    this.changeQty = function(id, newQty) {
        var storedItem = this.items[id];

        if (newQty <= 0) {
            this.totalQty -= storedItem.qty;
            this.totalPrice -= storedItem.item.price * storedItem.qty;
/*            storedItem.qty = 0;
            storedItem.price = 0;
            this.items[id] = null;*/
            delete this.items[id];
        } else {
            this.totalQty -= storedItem.qty;
            this.totalPrice -= storedItem.item.price * storedItem.qty;
            storedItem.qty = newQty;
            storedItem.price = storedItem.item.price * storedItem.qty;
            //"+" is added to make sure it is number, not string
            this.totalQty += +storedItem.qty;
            this.totalPrice += +storedItem.price;
        }
    };

    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
};