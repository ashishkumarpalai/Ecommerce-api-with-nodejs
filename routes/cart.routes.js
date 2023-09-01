const express = require("express")
const { authenticate } = require("../middleware/auth.middleware")
const { CartModel } = require("../models/cart.model")

const cartRouter = express.Router()

cartRouter.post("/:id", authenticate, async (req, res) => {
    try {
        const user = req.body.user;
        const productId = req.params.id;

        let cart = await CartModel.findOne({ user: user });
        if (!cart) {
            cart = new CartModel({
                user: user,
                products: [{ product: productId, quantity: 1 }] // Use the 'products' field
            });
            await cart.save();
            res.status(201).json({ message: 'Product added to cart successfully' });
        } else {
            // Check if the product is already in the cart
            const productIndex = cart.products.findIndex(
                (item) => item.product.toString() === productId
            );

            if (productIndex !== -1) {
                res.status(200).json({ message: 'Product is already in cart' });
            } else {
                cart.products.push({ product: productId, quantity: 1 });
                await cart.save();
                res.status(201).json({ message: 'Product added to cart successfully' });
            }
        }
    } catch (error) {
        console.log(error);
        res.send("Error while product add in the cart");
    }
});

cartRouter.get("/:userId", authenticate, async (req, res) => {
    try {
        const userId = req.params.userId;
        const cart = await CartModel.findOne({ user: userId }).populate("products");

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }

        res.status(200).json(cart.products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

cartRouter.delete("/:userId", authenticate, async (req, res) => {
    try {
        const userId = req.params.userId;
        const cart = await CartModel.findOneAndRemove({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }

        res.status(200).json({ message: 'Cart data removed successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
cartRouter.delete("/:userId/:itemId", authenticate, async (req, res) => {
    try {
        const userId = req.params.userId;
        const itemId = req.params.itemId;

        const cart = await CartModel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }

        // Find the index of the item in the 'products' array
        const itemIndex = cart.products.findIndex((item) =>
            item._id.toString() === itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in the cart' });
        }

        // Remove the item from the 'products' array
        cart.products.splice(itemIndex, 1);

        await cart.save();

        res.status(200).json({ message: 'Item removed from the cart successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = { cartRouter }
