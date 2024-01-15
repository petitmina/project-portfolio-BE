const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Cart = require('./Cart');
const Product = require('./Product');

const OrderSchema = Schema({
    userId: {type: mongoose.ObjectId, ref: User},
    status: {type: String, default: 'preparing'},
    totalPrice: {type: Number, required: true, default: 0},
    shipTo: {type: Object, required: true},
    contact: {type:Object, required: true},
    orderNum: {type: String},
    items: [{
        productId: {type: mongoose.ObjectId, ref: Product},
        qty: {type: Number, required: true, default: 1},
        color: {type: String, required: true},
        price: {type: Number, required: true},
    }]
}, {timestamps: true});

OrderSchema.methods.toJSON = function () {
    const obj = this._doc
    delete obj.__v
    delete obj.updateAt
    return obj
};

OrderSchema.post('save', async function() {
    const cart = await Cart.findOne({ userId: this.userId});
    cart.items = [];
    await cart.save();
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
