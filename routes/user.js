const express = require("express");
const authMiddleware = require("../middlewares/auth_middleware");
const { Product } = require("../models/ProductModel");
const { Order } = require("../models/OrderModel");
const userRouter = express.Router();
const User = require("../models/UserModel");

/// Passing a product via body of request and adding it to cart of user
userRouter.post("/api/add-to-cart", authMiddleware, async (req, res) => {
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
    user = await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//decrementing quantity of product and if it becomes 0, removing it from cart
userRouter.post("/api/remove-from-cart", authMiddleware, async (req, res) => {
  try {
    const { id } = req.body; //product id
    const product = await Product.findById(id);
    let user = await User.findById(req.userid);
    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].product._id.equals(product._id)) {
        user.cart[i].quantity -= 1;
        if (user.cart[i].quantity == 0) {
          user.cart.splice(i, 1);
        }
        break;
      }
    }
    user = await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//save user address
userRouter.post("/api/save-address", authMiddleware, async (req, res) => {
  try {
    const { address, phoneNumber } = req.body;
    let user = await User.findById(req.userid);
    user.address = address;
    user.phoneNumber = phoneNumber;
    user = await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//for becoming seller
userRouter.post("/api/turn-seller", authMiddleware, async (req, res) => {
  try {
    let user = await User.findById(req.userid);
    user.type = "admin";
    user = await user.save();
    res.json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Getting all orders of a particular user
userRouter.get("/api/get-all-orders", authMiddleware, async (req, res) => {
  try {
    let orders = await Order.find({ userId: req.userid });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//PLACING ORDER
userRouter.post("/api/order", authMiddleware, async (req, res) => {
  try {
    const { cart, address, paymentMode } = req.body;
    let products = [];
    for (let i = 0; i < cart.length; i++) {
      let product = await Product.findById(cart[i].product._id);
      //Bug
      //this algo has a problem as if some products were in stock so there quantity got reduced but if any product out of stock is found, we just return but we had already updated the quantity of prev products
      if (product.quantity >= cart[i].quantity) {
        product.quantity -= cart[i].quantity;
        // await product.save();
        products.push({ product, quantity: cart[i].quantity });
      } else {
        return res
          .status(400)
          .json({ message: `${product.name} is out of stock` });
      }
    }
    //this loop loops the products which are in stock and now saving them
    if (products.length > 0) {
      for (let i = 0; i < products.length; i++) {
        let p = products[i].product;
        await p.save();
      }
    }

    let user = await User.findById(req.userid);
    user.cart = [];
    user = await user.save();

    for (let i = 0; i < products.length; i++) {
      let order = new Order({
        product: products[i].product,
        quantity: products[i].quantity,
        totalPrice: products[i].product.price * products[i].quantity,
        address,
        userId: req.userid,
        sellerId: products[i].product.userid,
        orderedAt: new Date().getTime(),
        phoneNumber,
        paymentMode,
      });
      order = await order.save();
    }
    res.json("order placed successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Cancel / Return Order
userRouter.post("/api/cancel-order", authMiddleware, async (req, res) => {
  try {
    const { orderId, status, paymentMode } = req.body;
    if (status < 3) {
      //cancel order
      if (paymentMode == 1) {
        //Stripe
        //Generate refund
      }
      //Set status of order to be cancelled
    } else {
      //return order
      if (paymentMode == 1) {
        //Stripe
        //Generate refund
      }
      //Return message that delivery guy will reach soon and refund will be generated within 5 days
      res.json("Refund will be generated in 5-7 working days.");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = userRouter;
