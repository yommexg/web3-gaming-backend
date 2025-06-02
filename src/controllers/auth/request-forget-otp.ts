// import { Request, Response } from "express";
// import User from "../../models/User";

// import { generateOTPToken } from "../../utils/generateOTP";
// import { sendOTPEmail } from "../../utils/email/sendOTP";

// export const handleRequestPasswordResetOTP = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   if (!req.body) {
//     res.status(400).json({ success: false, message: "No Request Body found" });
//     return;
//   }

//   const { email } = req.body;

//   if (!email) {
//     res.status(400).json({ success: false, message: "Email is required" });
//     return;
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       res.status(404).json({ success: false, message: "User not found" });
//       return;
//     }

//     const otp = await generateOTPToken(email);
//     await sendOTPEmail(email, otp);

//     res
//       .status(200)
//       .json({ success: true, message: "OTP sent to your email address" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Failed to send OTP" });
//   }
// };
