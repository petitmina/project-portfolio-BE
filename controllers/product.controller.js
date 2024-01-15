const Product = require("../models/Product");

const productController = {};
const PAGE_SIZE = 5;

productController.createProduct = async(req, res) =>{
    try{
        const {sku, name, color, image, category, description, price, stock, status} = req.body;
        const product = new Product({
            sku, name, color, image, category, description, price, stock, status
        })

        await product.save();
        res.status(200).json({ status: 'success', product});
    } catch(error) {
        res.status(400).json({ status: 'faila', error: error.message});
    }
};

productController.getProduct = async (req, res) => {
    try {
      const { page, name } = req.query;
      const cond = name
        ? { name: { $regex: name, $options: "i" }, isDeleted: false }
        : { isDeleted: false };
      let query = Product.find(cond);
      let response = { status: "success" };
      if (page) {
        query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
        const totalItemNum = await Product.find(cond).count();
        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
        response.totalPageNum = totalPageNum;
      }
      const productList = await query.exec();
      response.data = productList;
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ status: "failb", error: error.message });
    }
  };

productController.updateProduct = async(req, res) => {
    try{
        const productId =req.params.id;
        const {sku, name, color, image, category, description, price, stock, status} = req.body;
        const product = await Product.findByIdAndUpdate(
            {_id: productId},
            {sku, name, color, image, category, description, price, stock, status},
            {new: true}
        );
        if(!product) throw new Error("item doesn't exit");
        res.status(200).json({ status: 'success', data: product})
    } catch(error) {
        return res.status(400).json({ status: "failc", error: error.message });
    }
};

productController.deleteProduct = async(req, res) => {
    try{
        const productId = req.params.id;
        const product = await Product.findByIdAndUpdate(
            {_id: productId},
            {isDeleted: true}
        );
        if(!product) throw new Error('No item found');
        res.status(200).json({ status: 'success'})
    }catch(error) {
        res.status(400).json({ status: 'faild', error: error.message})
    }
};

productController.getProductById = async(req, res) => {
    try{
        const productId = req.params.id;
        const product = await Product.findById(productId)
        if(!product) throw new Error('no Item found');
        res.status(200).json({ status: 'success', data: product})
    } catch(error) {
        return res.status(400).json({ status: 'faile', error: error.message})
    }
};

productController.checkStock = async(item) => {
    const product = await Product.findById(item.productId);
    if(product.stock[item.color] < item.qty) {
        return{
            isVerify: false,
            message: `${product.name}의 ${item.color} 재고가 부족합니다`,
        };
    }
    const newStock = { ...product.stock};
    newStock[item.color] -= item.qty;
    product.stock = newStock;

    await product.save();
    return {isVerify: true};
};

productController.checkItemListStock = async(itemList) => {
    const insufficientStockItems = [];
    await Promise.all(
        itemList.map(async (item) => {
            const stockCheck = await productController.checkStock(item);
            if(!stockCheck.isVerify) {
                insufficientStockItems.push({ item, message: stockCheck.message});
            }
            return stockCheck;
        })
    );
    return insufficientStockItems;
};

productController.getProductQty = async (req, res) => {
    try{
        const {userId} = req;
        const productQty = await Product.findOne({ userId});
        if(!productQty) throw new Error('상품을 선택하세요')
        res.status(200).json({ status: 'success', qty: productQty.item.length});
    } catch(error) {
        res.status(400).json({ status: 'fail5', error: error.message})
    }
}

module.exports = productController;