const express = require("express");
const authRouter = express.Router();
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth_middleware");

//SIGN-UP ROUTE
authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with same email already exists." });
    }
    hashedPass = await bcrypt.hash(password, 8);
    let user = new User({
      email,
      name,
      password: password,
    });

    user = await user.save();
    user.password = hashedPass;
    user = await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//LOGIN route
authRouter.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //1 we check does the email exists in db
    //2 is the pass correct
    //3 generate token

    //1
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist, create a new account." });
    }
    //2
    match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect Passwrd" });
    }
    //3
    const token = jwt.sign({ id: user._id }, "passwordKey");
    res.json({ token, ...user._doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Validating the token on startup of the app
authRouter.post("/isTokenValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const isVerified = jwt.verify(token, "passwordKey");
    if (!isVerified) return res.json(false);
    //now if it is verified , do we have a user for that id?
    const user = await User.findById(isVerified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

authRouter.get("/getUserData", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userid);
    res.json({ ...user._doc, token: req.token });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = authRouter;
