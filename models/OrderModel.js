const mongoose = require("mongoose");
const { ProductSchema } = require("./ProductModel");

const orderSchema = mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  },
  product: ProductSchema,
  quantity: {
    type: Number,
    required: true,
  },

  totalPrice: {
    type: Number,
    required: true,
  },
  orderedAt: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    default: 0, //0 means order placed, 1 means dispatched by seller, 2 means reached at city of user, 3 means delivered successfully
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, orderSchema };
