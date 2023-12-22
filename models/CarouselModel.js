const mongoose = require("mongoose");

const CarouselSchema = mongoose.Schema({
  images: [
    {
      type: String,
      required: true,
    },
  ],
});

const Carousel = mongoose.model("Carousel", CarouselSchema);

module.exports = { Carousel, CarouselSchema };
