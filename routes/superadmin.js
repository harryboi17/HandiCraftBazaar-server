const express = require("express");
const superAdminRouter = express.Router();
const { Product } = require("../models/ProductModel");
const { Order } = require("../models/OrderModel");
const { User } = require("../models/UserModel");
const superAdminMiddleware = require("../middlewares/super_admin_middleware");

//Getting all the users on the application
superAdminRouter.get(
  "/superadmin/allusers",
  superAdminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//Getting all the products on the application
superAdminRouter.get(
  "/superadmin/allproducts",
  superAdminMiddleware,
  async (req, res) => {
    try {
      var products = await Product.find();
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//deleting a user using the id of the user sent is the request
superAdminRouter.delete(
  "/superadmin/deleteuser",
  superAdminMiddleware,
  async (req, res) => {
    try {
      const pid = req.header("pid");

      const user = await User.findById(pid);
      if (!user) {
        return res
          .status(404)
          .json({ message: `No user exists with id: ${pid}` });
      }
      //removing from cloudinary
      // const imgID=user.avatar.publicID;
      // await cloudinary.v2.uploader.destroy(imgID);

      await user.remove();

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//Deleting a particular product
superAdminRouter.delete(
  "/superadmin/delete-product",
  superAdminMiddleware,
  async (req, res) => {
    try {
      const pid = req.header("pid");
      const product = await Product.findById(pid);
      if (!product) {
        return res
          .status(404)
          .json({ message: `No product exists with id: ${pid}` });
      }
      //removing from cloudinary
      // const imgID=user.avatar.publicID;
      // await cloudinary.v2.uploader.destroy(imgID);

      await product.remove();

      res
        .status(200)
        .json({ success: true, message: "Product Deleted Successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
//deal of the day feature

module.exports = superAdminRouter;
