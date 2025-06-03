import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../../models/User";
import VerificationToken from "../../models/VerificationToken";
import { isEmailValid, isPasswordValid } from "../../utils/regex";

export const handleRegisterUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body) {
    res.status(400).json({ success: false, message: "No Request Body found" });
    return;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Incomplete Details" });
    return;
  }

  if (!isEmailValid(email)) {
    res.status(400).json({ success: false, message: "Invalid Email" });
    return;
  }

  if (!isPasswordValid(password)) {
    res.status(400).json({ success: false, message: "Weak Password" });
    return;
  }

  try {
    // 1. Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ success: false, message: "User already exists" });
      return;
    }

    const record = await VerificationToken.findOne({ email });

    if (!record || !record.isVerified) {
      res.status(401).json({
        success: false,
        message: "Unauthorized Attempt",
      });
      return;
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (record.updatedAt < fiveMinutesAgo) {
      await VerificationToken.deleteOne({ email });
      res.status(403).json({
        success: false,
        message: "Verification expired. Please verify again.",
      });
      return;
    }

    // 3. Create the user
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
    });

    await VerificationToken.deleteOne({ email });

    res
      .status(201)
      .json({ success: true, message: "Account successfully created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};
