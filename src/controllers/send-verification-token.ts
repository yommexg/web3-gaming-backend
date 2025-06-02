import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { isEmailValid } from "../utils/regex";
import User from "../models/User";
import { generateVerificationToken } from "../utils/generateToken";
import { sendVerificationEmail } from "../utils/email/sendVerification";

export const handleSendVerificationToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body) {
    res.status(400).json({ success: false, message: "No Request Body found" });
    return;
  }

  const { email } = req.body;

  if (!email) {
    res.status(400).json({ success: false, message: "Email Required" });
    return;
  }

  if (!isEmailValid(email)) {
    res.status(400).json({ success: false, message: "Invalid Email" });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ success: false, message: "User already exists" });
      return;
    }

    // Generate new token
    const token = await generateVerificationToken(email);

    await sendVerificationEmail(email, token);

    res.status(201).json({ success: true, message: "Email verification sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
