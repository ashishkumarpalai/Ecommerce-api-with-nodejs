const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const { CartModel } = require("../models/cart.model");
const { OrderModel } = require("../models/order.model");

const orderRouter = express.Router();

// Place an order from the user's cart
orderRouter.post("/", authenticate, async (req, res) => {
    try {
        const userId = req.body.user;

        // Find the user's cart
        // const cart = await CartModel.findOne({ user: userId }).populate("product");
        const cart = await CartModel.findOne({ user: userId }).populate("products");

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Calculate the total amount and prepare order data
        const totalAmount = cart.products.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);

        const order = new OrderModel({
            user: userId,
            products: cart.products.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
            })),
            totalAmount,
        });

        await order.save();

        // Clear the user's cart
        cart.products = [];
        await cart.save();

        res.status(201).json({ message: "Order placed successfully", orderId: order._id });
        await CartModel.findOneAndRemove({ user: userId })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Fetch order history for authenticated users
orderRouter.get("/", authenticate, async (req, res) => {
    try {
        const userId = req.body.user;
        const orders = await OrderModel.find({ user: userId }).populate("products");

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Fetch details of a specific order by its ID
orderRouter.get("/:orderId", authenticate, async (req, res) => {
    try {
        const userId = req.body.user;
        const orderId = req.params.orderId;
        const order = await OrderModel.findOne({ _id: orderId, user: userId }).populate("products");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = { orderRouter };
