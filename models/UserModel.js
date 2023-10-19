const mongoose = require("mongoose");
const { ProductSchema } = require("./ProductModel");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        const re =
          /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
        return value.match(re);
      },
      message: "Enter valid email",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return value.length > 6;
      },
      message: "Enter valid password",
    },
  },
  address: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "user", //user, admin, super admin
  },
  cart: [
    {
      product: ProductSchema,
      quantity: {
        type: Number,
        default: 0,
      },
    },
  ],
  sellerOrders: [
    {
      product: ProductSchema,
      userName: {
        type: String,
      },
      userAddress: {
        type: String,
      },
      userNumber: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
