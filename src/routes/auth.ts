import express from "express";
import { handleSendVerificationToken } from "../controllers/send-verification-token";

const authRouter = express.Router();

authRouter.post("/send-verification-token", handleSendVerificationToken);

export default authRouter;
