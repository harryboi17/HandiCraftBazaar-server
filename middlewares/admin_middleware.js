const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

//this middleware verifies the token,gets a user by the given id, verifies if that user is a seller or not
const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      res
        .status(401)
        .json({ message: "No access token in header, access denied" });
    const isVerified = jwt.verify(token, "passwordKey");
    if (!isVerified)
      return res
        .status(401)
        .json({ message: "Access token not verified, Unauthorized user" });

    const userId = isVerified.id;
    const user = await User.findById(userId);

    if (user.type == "user" || user.type == "super admin")
      return res
        .status(401)
        .json({ message: "You are not an admin, Unauthorized user" });

    req.userid = userId;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = adminMiddleware;
