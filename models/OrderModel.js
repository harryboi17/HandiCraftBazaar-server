const mongoose = require("mongoose");
const {ProductSchema}=require('./ProductModel');

const orderSchema = mongoose.Schema({
  //order id, name, address, cart,userid

  address: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
  products: [
    {
      product: ProductSchema,
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
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
    default: 0, //0 means ordered, 1 means dispatched, 2 means out for delivery, 3 means delivered
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
