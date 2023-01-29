const mongoose=require('mongoose');
const ratingsSchema = require('./RatingsModel');

const ProductSchema=mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim:true,
    },
    desc:{
        type:String,
        required: true,
        trim:true,
        
    },
    category:{
        type:String,
        required:true,
        trim:true,
    },
    images:[{
        type:String,
        required:true
    }],
    quantity:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    userid:{
        type:String
    },
    ratings:[ratingsSchema],
})

const Product=mongoose.model("Product",ProductSchema);

module.exports={Product,ProductSchema};
// module.exports=ProductSchema;