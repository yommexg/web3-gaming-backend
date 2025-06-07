import express from "express";
import { handleSendVerificationToken } from "../controllers/auth/send-verification-token";
import { handleVerifyEmailToken } from "../controllers/auth/verify-token";
import { handleRegisterUser } from "../controllers/auth/register";
import { handleRequestPasswordResetOTP } from "../controllers/auth/request-forget-otp";
import { handleVerifyForgetOTP } from "../controllers/auth/verify-forget-otp";
import { handleResetPassword } from "../controllers/auth/reset-password";
import {
  handleLoginUser,
  handleVerifyNewDeviceAndLogin,
} from "../controllers/auth/login";
import { handleRefreshToken } from "../controllers/auth/refreshToken";

const authRouter = express.Router();

// Register
authRouter.post("/send-verification-token", handleSendVerificationToken);
authRouter.get("/verify-token", handleVerifyEmailToken);
authRouter.post("/register", handleRegisterUser);

// Forget
authRouter.post("/request-forget-otp", handleRequestPasswordResetOTP);
authRouter.post("/verify-forget-otp", handleVerifyForgetOTP);
authRouter.post("/reset-password", handleResetPassword);

//Login
authRouter.post("/login", handleLoginUser);
authRouter.post("/verify-and-login", handleVerifyNewDeviceAndLogin);
authRouter.get("/refresh", handleRefreshToken);

export default authRouter;
