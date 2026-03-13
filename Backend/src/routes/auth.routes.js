import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", authController.registerUserController);
authRouter.post("/login", authController.loginUserController);
authRouter.post("/logout", authController.logoutUserController);
authRouter.get("/get-me", authMiddleware, authController.getMeController);

authRouter.post("/forgot-password", authController.forgotPasswordController);
authRouter.post("/verify-otp", authController.verifyOtpController);
authRouter.post("/reset-password", authController.resetPasswordController);

export default authRouter;