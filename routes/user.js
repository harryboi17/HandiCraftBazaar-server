const express = require("express");
const authmiddleware = require("../middlewares/authmiddleware");
const { Product } = require("../models/ProductModel");
const User = require("../models/UserModel");
const userRouter = express.Router();

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

module.exports = userRouter;
