const express = require("express");
const authmiddleware = require("../middlewares/authmiddleware");
const { Product } = require("../models/ProductModel");
const User = require("../models/UserModel");
const userRouter = express.Router();
const Order=require('../models/OrderModel');

//add a product to cart
//user model me ek product add krna h
// to body me product ayega or use user model me add krna h
userRouter.post("/api/add-to-cart", authmiddleware, async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    let user = await User.findById(req.userid);
    let isProductFound = false;
    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].product._id.equals(product._id)) {
        isProductFound = true;
        user.cart[i].quantity += 1;
        break;
      }
    }
    if (!isProductFound) {
      user.cart.push({ product, quantity: 1 });
    }
    user=await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//decrementing quantity of product and if it becomes 0, removing it from cart
userRouter.post('/api/remove-from-cart',authmiddleware,async(req,res)=>{
  try {
    const {id}=req.body;//product id
    const product=await Product.findById(id);
    let user=await User.findById(req.userid);
    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].product._id.equals(product._id)) {
        user.cart[i].quantity -= 1;
        if(user.cart[i].quantity==0){
          user.cart.splice(i,1);
        }
        break;
      }
    }
    user=await user.save();
    res.json(user);

  } catch (error) {
    res.status(500).json({error:error.message});
  }
})

//save user address
userRouter.post('/api/save-address',authmiddleware,async(req,res)=>{
  try {
    const {address} =req.body;
    console.log(address)
    let user=await User.findById(req.userid);
    user.address=address;
    user=await user.save();
    res.json(user);

  } catch (error) {
    res.status(500).json({error:error.message});
  }
})


//Place an order
userRouter.post('/api/order',authmiddleware,async(req,res)=>{
  try {
    const {cart,totalPrice,address} =req.body;
    // console.log(cart,totalPrice,address );
    let products=[];
    for(let i=0;i<cart.length;i++){
      let product=await Product.findById(cart[i].product._id);
      //this algo has a problem as if some products were in stock so there quantity got reduced but if any product out of stock is found, we just return but we had already updated the quantity of prev products
      if(product.quantity>=cart[i].quantity){
        product.quantity-=cart[i].quantity;
        // await product.save();
        products.push({product,quantity:cart[i].quantity});
      }
      else{
       return res.status(400).json({message:`${product.name} is out of stock`})
      }
    }
    // console.log(products.length);
    //this loop loops the products which are in stock and now saving them
    if(products.length>0)
    {
    for(let i=0;i<products.length;i++){
      let p=products[i].product;
      await p.save();
    }}

    let user=await User.findById(req.userid);
    user.cart=[];
    user=await user.save();

    let order=new Order({
      products,
      totalPrice,
      address,
      userid:req.userid,
      orderedAt:new Date().getTime(),
    })

    order=await order.save();
    res.json(order);

  } catch (error) {
    res.status(500).json({error:error.message});
  }
})

//Getting all orders of a particular user
userRouter.get('/api/get-all-orders',authmiddleware,async(req,res)=>{
  try {
    let orders=await Order.find({userid:req.userid});
    res.json(orders);
  } catch (error) {
    res.status(500).json({error:error.message});
  }
})

module.exports = userRouter;
