//IMPORTS
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const body_parser = require("body-parser");
const dotenv = require("dotenv");

//MODULE EXPORTS
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/products");
const userRouter = require("./routes/user");
const superAdminRouter = require("./routes/superadmin");

//INITIALIZATIONS
const app = express();
dotenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT;
const DB = process.env.DB;

//MIDDLEWARES
app.use(cors());
app.use(body_parser.urlencoded({ extended: true }));
app.use(express.json());

//CONNECTIONS
mongoose.set("strictQuery", false);
mongoose.connect(DB).then(() => {
  console.log("Connection to database successful!");
  app.use(authRouter);
  app.use(adminRouter);
  app.use(productRouter);
  app.use(userRouter);
  app.use(superAdminRouter);
});
//HOME PAGE
app.get("/", (req, res) => {
  res.json({ "server status": "running" });
});

//LISTENING TO THE SERVER
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
