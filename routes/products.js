const express = require("express");
const productRouter = express.Router();
const authMiddleware = require("../middlewares/auth_middleware");
const { Product } = require("../models/ProductModel");

productRouter.get("/api/getProducts", authMiddleware, async (req, res) => {
  //Get products filtered according to category
  try {
    if (req.query.category == "All Categories") {
      var products = await Product.find();
      return res.json(products);
    }
    var products = await Product.find({ category: req.query.category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

productRouter.get(
  "/api/getProducts/search/:name",
  authMiddleware,
  async (req, res) => {
    //Searching products by name in request parameters
    try {
      //using regex to get products whose name starts with and contains the entered letters
      var products = await Product.find({
        name: { $regex: req.params.name, $options: "i" },
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//Rating a product
productRouter.post("/api/rate-product", authMiddleware, async (req, res) => {
  try {
    const { id, rating } = req.body;
    let product = await Product.findById(id);
    // BUG
    // the searching can be optimized ig
    try {
      for (let i = 0; i < product.ratings.length; i++) {
        if (product.ratings[i].userId == req.userid) {
          product.ratings.splice(i, 1);
          break;
        }
      }
    } catch (error) {}
    const ratingSchema = { userId: req.userid, rating: rating };
    product.ratings.push(ratingSchema);
    product = await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Deal of the day
//Product with highest rating sum is the deal of the day
productRouter.get("/api/deal-of-the-day", async (req, res) => {
  try {
    let products = await Product.find({});
    // if (!products )
    //   return res.status(500).json({ message: "No product so no deal" });

    products = products.sort((a, b) => {
      let asum = 0;
      let bsum = 0;
      for (let i = 0; i < a.ratings.length; i++) {
        asum += a.ratings[i].rating;
      }
      asum = a.ratings.length == 0 ? 0 : asum / a.ratings.length;

      for (let i = 0; i < b.ratings.length; i++) {
        bsum += b.ratings[i].rating;
      }
      bsum = b.ratings.length == 0 ? 0 : bsum / b.ratings.length;

      return asum < bsum ? 1 : -1;
    });

    res.json(products[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = productRouter;
