import express from "express";
import { handleSendVerificationToken } from "../controllers/auth/send-verification-token";
import { handleVerifyEmailToken } from "../controllers/auth/verify-token";
import { handleRegisterUser } from "../controllers/auth/register";

const authRouter = express.Router();

authRouter.post("/send-verification-token", handleSendVerificationToken);
authRouter.get("/verify-token", handleVerifyEmailToken);
authRouter.post("/register", handleRegisterUser);

export default authRouter;
