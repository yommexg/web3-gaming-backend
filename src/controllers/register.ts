// import bcrypt from "bcryptjs";
// import { Request, Response } from "express";
// import User from "../../models/User";
// import VerificationOTP from "../../models/VerificationOTP";

// export const handleRegisterUser = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   if (!req.body) {
//     res.status(400).json({ success: false, message: "No Request Body found" });
//     return;
//   }

//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     res.status(400).json({ success: false, message: "Incomplete Details" });
//     return;
//   }

//   try {
//     // 1. Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       res.status(409).json({ success: false, message: "User already exists" });
//       return;
//     }

//     // 2. Check if OTP was verified for this email
//     const verifiedOTP = await VerificationOTP.findOne({ email });

//     if (!verifiedOTP) {
//       res.status(400).json({ success: false, message: "Email Not Found" });
//       return;
//     }

//     if (!verifiedOTP.isVerified) {
//       res.status(401).json({
//         success: false,
//         message: "OTP not verified or expired. Please verify first.",
//       });
//       return;
//     }

//     // 3. Create the user
//     const hashedPassword = await bcrypt.hash(password, 10);

//     await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       isVerified: true,
//     });

//     // 4. Cleanup OTP record
//     await VerificationOTP.deleteOne({ email });

//     res
//       .status(201)
//       .json({ success: true, message: "Account successfully created" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Registration failed" });
//   }
// };
