const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Product = require('./Product');

const CartSchema = Schema({
    userId: {type: mongoose.ObjectId, ref: User},
    items: [{
        productId: {type: mongoose.ObjectId, ref: Product},
        color: {type: String, required: true},
        qty: {type: Number, default:1},
    }]
}, {timestamps: true})

CartSchema.methods.toJSON = function() {
    const obj = this._doc
    delete obj.updateAt
    return obj
}

const Cart = mongoose.model('Cart', CartSchema);
module.exports = CartSchema;