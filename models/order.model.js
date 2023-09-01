const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "ProductModel" },
      quantity: Number,
      price: Number,
    },
  ],
//   totalAmount: Number,
  orderDate: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model("OrderModel", orderSchema);

module.exports = { OrderModel };
