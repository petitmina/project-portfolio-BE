const Cart = require('../models/Cart');

const cartController = {};

cartController.addItemToCart = async (req, res) => {
    try{
        const { userId } = req;
        const {productId, color, qty } = req.body;
        let cart = await Cart.findOne({ userId });
        if(!cart) {
            cart = new Cart({userId});
            await cart.save();
        }

        const existItem = cart.items.find(
            (item) => item.productId.equals(productId) && item.color === color
        );

        if(existItem) throw new Error('아이템이 이미 카트에 있습니다');
        cart.items = [...cart.items, {productId, color, qty}];
        await cart.save();
        res.status(200).json({ status: 'success', data: cart, cartItemQty: cart.items.length});
    } catch(error) {
        res.status(400).json({ status: 'fail1', error: error.message});
    }
};

cartController.getCart = async(req, res) => {
    try{
        const { userId } = req;
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items',
            populate: {
                path: 'productId',
                model: 'Product',
            }
        });
        return res.status(200).json({ status: 'success', data: cart.items});
    } catch(error) {
        return res.status(400).json({ status: 'fail2', error: error.message });
    }
};

cartController.deleteCartItem = async(req, res) => {
    try{
        const {id} =req.params;
        const {userId} = req;
        const cart = await Cart.findOne({ userId });
        cart.items = cart.items.filter((item) => !item._id.equals(id));

        await cart.save();
        res.status(200).json({ status: 'success', cartItemQty: cart.items.length })
    } catch(error) {
        return res.status(400).json({ status: 'fail3', error: error.message})
    }
};

cartController.editCartItem = async(req, res) => {
    try{
        const {id} = req.params;
        const { userId }= req;

        const { qty } = req.body;
        const cart = await Cart.findOne({userId}).populate({
            path: 'items',
            populate: {
                path: 'productId',
                model: "Product",
            },
        });
        if(!cart) throw new Error('회원님의 장바구니는 존재하지 않습니다');
        const index = cart.items.findIndex((item) =>  item._id.equals(id));
        if(index === -1) throw new Error('상품을 찾을 수 없습니다');
        cart.items[index].qty = qty;
        await cart.save();
        res.status(200).json({ status: 'success', data: cart.items});
    }catch(error){
        res.status(400).json({status: 'fail4', error: error.message});
    }
};

cartController.getCartQty = async (req, res) => {
    try{
        const {userId} = req;
        const cart = await Cart.findOne({ userId});
        if(!cart) throw new Error('카트가 존재하지 않습니다')
        res.status(200).json({ status: 'success', qty: cart.items.length});
    } catch(error) {
        return res.status(400).json({ status: 'fail123', error: error.message})
    }
}

module.exports = cartController;