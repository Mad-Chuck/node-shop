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
        storedItem.price += storedItem.item.price;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    this.remove = function(id) {
        //pointer to current product
        var storedItem = this.items[id];

        this.totalQty -= storedItem.qty;
        this.totalPrice -= storedItem.price;
        /*storedItem.qty = 0;
        storedItem.price = 0;
        storedItem = null;*/
        delete this.items[id];
    };

    this.changeQty = function(id, newQty) {
        //pointer to current product
        var storedItem = this.items[id];

        if (newQty <= 0) {
            this.totalQty -= storedItem.qty;
            this.totalPrice -= storedItem.price;
            /*storedItem.qty = 0;
            storedItem.price = 0;
            storedItem = null;*/
            delete this.items[id];
        } else {
            this.totalQty += newQty - storedItem.qty;
            this.totalPrice -= storedItem.price;
            storedItem.qty = newQty;
            storedItem.price = storedItem.item.price * storedItem.qty;
            this.totalPrice += storedItem.price;
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