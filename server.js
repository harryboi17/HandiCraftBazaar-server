//IMPORTS
const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const body_parser=require('body-parser')

//MODULE EXPORTS
const authRouter=require('./routes/auth');
const adminRouter=require('./routes/admin');
const productRouter=require('./routes/products');
const userRouter = require('./routes/user');

//INITIALIZATIONS
const app=express();
const PORT=4999
const DB="mongodb+srv://sahaj_279:chennaiexpress1A@cluster0.fktjfco.mongodb.net/sahajdb"

//MIDDLEWARES
app.use(cors())
app.use(body_parser.urlencoded({extended:true}))
app.use(body_parser.json())

//CONNECTIONS
mongoose.set("strictQuery", false);
mongoose.connect(DB).then(
    ()=>{
        console.log("Connection to database successful!");
        app.use(authRouter)
        app.use(adminRouter)
        app.use(productRouter)
        app.use(userRouter)

    }
)
//HOME PAGE
app.get('/',(req,res)=>{
    res.json({"working":"fine"})
})

//LISTENING TO THE SERVER
app.listen(PORT,()=>{
    console.log("Server started at port "+`${PORT}`);
})

