const mongoose = require("mongoose");
const { ProductSchema } = require("./ProductModel");

const orderSchema = mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
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
  stripePaymentId: {
    type: String,
    default: "",
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
  paymentMode: {
    type: Number,
    required: true,
    default: 0, //0 means COD, 1 means stripe
  },
  status: {
    type: Number,
    default: 0, //0 means order placed, 1 means dispatched by seller, 2 means reached at city of user, 3 means delivered successfully, 5 cancelled
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, orderSchema };
