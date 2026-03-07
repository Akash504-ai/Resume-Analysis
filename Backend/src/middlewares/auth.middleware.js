import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js";

async function authUser(req, res, next) {
  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication token not provided"
      });
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });

    if (isTokenBlacklisted) {
      return res.status(401).json({
        message: "Token is blacklisted. Please login again."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      message: "Invalid or expired token"
    });

  }
}

export default authUser;