const express = require("express");
const adminRouter = express.Router();
const { Product } = require("../models/ProductModel");
const { Order } = require("../models/OrderModel");
const adminMiddleware = require("../middlewares/admin_middleware");

//Adding a Product
adminRouter.post("/admin/addProduct", adminMiddleware, async (req, res) => {
  try {
    const { name, desc, images, category, quantity, price } = req.body;
    let product = new Product({
      name: name,
      desc: desc,
      images: images,
      category: category,
      quantity: quantity,
      price: price,
      userid: req.userid,
    });

    product = await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Getting all the products a seller has added
adminRouter.get("/admin/all-products", adminMiddleware, async (req, res) => {
  try {
    var products = await Product.find({ userid: req.userid });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Getting all the orders a seller has received
adminRouter.get("/admin/all-orders", adminMiddleware, async (req, res) => {
  try {
    //the middleware proved that the user who sent the request is an admin
    var orders = await Order.find({});
    var allOrders = [];
    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].products.length; j++) {
        if (orders[i].products[j].product.userid == req.userid) {
          allOrders.push(orders[i]);
        }
      }
    }

    res.json(allOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Updating status of order
adminRouter.patch(
  "/admin/update-status-of-order",
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.body;
      let order = await Order.findById(id);
      if (order.status == 3) {
        return;
      }
      order.status += 1;
      order = await order.save();
      res.json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//Deleting a particular product
adminRouter.delete(
  "/admin/delete-a-product",
  adminMiddleware,
  async (req, res) => {
    try {
      const pid = req.header("pid");
      await Product.findByIdAndDelete(pid);
      res.json({ message: "Product Deleted Successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

adminRouter.get("/admin/analytics", adminMiddleware, async (req, res) => {
  try {
    let orders = await Order.find({});
    let totalEarnings = 0;
    let Pottery = 0;
    let Embroidery = 0;
    let Jewelry = 0;
    let Paintings = 0;
    let Sculptures = 0;
    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].products.length; j++) {
        if (orders[i].products[j].product.userid == req.userid) {
          let earning =
            orders[i].products[j].quantity *
            orders[i].products[j].product.price;
          totalEarnings += earning;
          switch (orders[i].products[j].product.category) {
            case "Pottery":
              Pottery += earning;
              break;
            case "Embroidery":
              Embroidery += earning;
              break;
            case "Jewelry":
              Jewelry += earning;
              break;
            case "Paintings":
              Paintings += earning;
              break;
            case "Sculptures":
              Sculptures += earning;
              break;

            default:
              break;
          }
        }
      }
    }

    res.json({
      totalEarnings,
      Pottery,
      Jewelry,
      Embroidery,
      Paintings,
      Sculptures,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = adminRouter;
