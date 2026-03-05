const { Router } = require('express')
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const authRouter = Router()

// Register
authRouter.post("/register", authController.registerUserController)

// Login
authRouter.post("/login", authController.loginUserController)

// Logout
authRouter.post("/logout", authController.logoutUserController)

// Get current user
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)

module.exports = authRouter