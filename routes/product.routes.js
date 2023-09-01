const express=require("express")
const {ProductModel}=require("../models/product.model")

const productRouter=express.Router()

//get the all category

productRouter.get("/category",async(req,res)=>{
    try {
        let product=await ProductModel.distinct('category');
        res.status(200).send(product)
    } catch (error) {
        res.send({"error":error.message})
    }
})

// add product data 

productRouter.post('/', async (req, res) => {
    try {
        const { title, image, price, category,availablity,description } = req.body;

        // Create a new product
        const newProduct = new ProductModel({
            title,
            image,
            price,
            category,
            availablity,
            description
        });

        // Save the product to the database
        await newProduct.save();
        res.status(201).send({"msg":"product data added successfully"})
    } catch (error) {
        res.status(400).send({"error":error.message})
    }
});

//get the all products

productRouter.get("/",async(req,res)=>{
    try {
        let product=await ProductModel.find();
        res.status(200).send(product)
    } catch (error) {
        res.send({"error":error.message})
    }
})

//get product by theire id

productRouter.get("/:id",async(req,res)=>{
    try {
        let product=await ProductModel.findById(req.params.id);
        res.status(200).send(product)
    } catch (error) {
        res.status(400).send({"error":error.message})
    }
})

module.exports={productRouter}