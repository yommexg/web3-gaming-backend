import express from "express";
import { handleSendVerificationToken } from "../controllers/auth/send-verification-token";
import { handleVerifyEmailToken } from "../controllers/auth/verify-token";

const authRouter = express.Router();

authRouter.post("/send-verification-token", handleSendVerificationToken);
authRouter.get("/verify-token", handleVerifyEmailToken);

export default authRouter;
