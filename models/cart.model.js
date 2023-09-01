const mongoose = require("mongoose");

const { UserModel } = require("./user.model")
const { ProductModel } = require("./product.model")



const cartSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductModel' },
        quantity: { type: Number, default: 1 }
    }],
});


const CartModel = mongoose.model("cart", cartSchema);

module.exports = {
    CartModel
};