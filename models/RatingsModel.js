const mongoose=require('mongoose');

const ratingsSchema=mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
    }
})

module.exports=ratingsSchema