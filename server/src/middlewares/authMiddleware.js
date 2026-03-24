import jwt from "jsonwebtoken"
import * as userModels from "../models/userModels.js" 



export const verifyAccessToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401);

    // Synchronously verify token
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Fetch user from DB
    const userFromDB = await userModels.selectUser(payload.user_id);
    if (!userFromDB) return res.status(404).json({ message: "User not found" });

    req.user = userFromDB;
    next();

  } catch (err) {
    console.error("MIDDLEWARE: ERROR VERIFYING ACCESS TOKEN", err);
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Access token expired" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};





export const verifyRefreshToken = (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token found" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
      }

      req.user = user;
      next();
      
    });

  } catch (err) {
    console.error("MIDDLEWARE: Refresh Token Invalid,", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

