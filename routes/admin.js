const express = require("express");
const adminRouter = express.Router();
const { Product } = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const adminmiddleware = require("../middlewares/admin_middleware");

//Adding a Product
adminRouter.post("/admin/addProduct", adminmiddleware, async (req, res) => {
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

//Getting all the products an admin has added
adminRouter.get("/admin/all-products", adminmiddleware, async (req, res) => {
  try {
    //the middleware proved that the user who sent the request is an admin
    var products = await Product.find({ userid: req.userid });
    // if(products==null || products.length==0){
    //     return res.json({message:'No products have been added yet'});
    // }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Getting all the orders an admin has received
adminRouter.get("/admin/all-orders", adminmiddleware, async (req, res) => {
  try {
    //the middleware proved that the user who sent the request is an admin
    var orders = await Order.find({});
    // for(let i=0;i<orders.length;i++){
    //     for(let j=0;j<orders[i].products.length;j++){
    //         if(req.userid==orders[i].products[j].product.userid)

    //     }
    // }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Updating status of order
adminRouter.patch(
  "/admin/update-status-of-order",
  adminmiddleware,
  async (req, res) => {
    try {
      const { id } = req.body;
      let order = await Order.findById(id);
      order.status += 1;

      order = await order.save();
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//Deleting a particular product
adminRouter.delete(
  "/admin/delete-a-product",
  adminmiddleware,
  async (req, res) => {
    try {
      //the middleware proved that the user who sent the request is an admin
      const pid = req.header("pid");
      var products = await Product.findByIdAndDelete(pid);
      // if(products==null || products.length==0){
      //     return res.json({message:'No products have been added yet'});
      // }
      res.json({ message: "Product Deleted Successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

adminRouter.get("/admin/analytics", adminmiddleware, async (req, res) => {
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
        let earning =
          orders[i].products[j].quantity * orders[i].products[j].product.price;
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

    res.json({ totalEarnings, Pottery, Jewelry, Embroidery, Paintings, Sculptures });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = adminRouter;
