const express=require('express');
const adminRouter=express.Router();
const {Product}=require('../models/ProductModel');
const adminmiddleware=require('../middlewares/admin_middleware');

//Adding a Product
adminRouter.post('/admin/addProduct',adminmiddleware,async(req,res)=>{
    try {
        const {name,desc,images,category,quantity,price}=req.body;
        let product=new Product({
            name:name,desc:desc,images:images,category:category,quantity:quantity,price:price,userid:req.userid,
        })

        product=await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

//Getting all the products an admin has added
adminRouter.get('/admin/all-products',adminmiddleware,async(req,res)=>{
    try {
        //the middleware proved that the user who sent the request is an admin
        var products=await Product.find({userid:req.userid})
        // if(products==null || products.length==0){
        //     return res.json({message:'No products have been added yet'});
        // }
        res.json(products)
    } catch (error) {
        res.status(500).json({error:error.message});
        
    }
})

//Deleting a particular product
adminRouter.delete('/admin/delete-a-product',adminmiddleware,async(req,res)=>{
    try {
        //the middleware proved that the user who sent the request is an admin
        const pid=req.header('pid');
        var products=await Product.findByIdAndDelete(pid)
        // if(products==null || products.length==0){
        //     return res.json({message:'No products have been added yet'});
        // }
        res.json({message:'Product Deleted Successfully'})
    } catch (error) {
        res.status(500).json({error:error.message});
        
    }
})

module.exports=adminRouter;