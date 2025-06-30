const jwt = require("jsonwebtoken");
require("dotenv").config();
const User= require("../models/users")

exports.auth =async (req, res, next) => {
    try {
      const token=
			
			 req.cookies.token || req.header("Authorization").replace("Bearer ", "")||req.body.token  ;
      console.log("🧩 [auth] Middleware Hit");
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "token missing",
        });
      }
      console.log("Token received:", token);
      console.log("JWT_SECRET being used:", process.env.JWT_SECRET);
      try {
        const payload =  jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: "token is invalidddddddd",
        });
      }
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "something went wrong while verifyingggg the token ",
      });
    }
  };

  exports.isStudent = (req, res, next) => {
    try {
      if (req.user.accountType != "Student") {
        return res.status(401).json({
          success: false,
          message: "this is the route for student.",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "User Role is not matching",
      });
    }
  };
  exports.isInstructor = (req, res, next) => {
    try {
      if (req.user.accountType !== "Instructor") {
        return res.status(401).json({
          success: false,
          message: "this is the route for Instructors.",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "User Role is not matching",
      });
    }
  };
  
  exports.isAdmin = (req, res, next) => {
    try {
      if (req.user.accountType !== "Admin") {
        
        return res.status(401).json({
          success: false,
          message: "this is the route for Admins.",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "User Role is not matching",
      });
    }
  };
  