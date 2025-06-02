// import { Request, Response } from "express";
// import VerificationOTP from "../../models/VerificationOTP";
// import User from "../../models/User";

// export const handleVerifyOTP = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   if (!req.body) {
//     res.status(400).json({ success: false, message: "No Request Body found" });
//     return;
//   }

//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     res
//       .status(400)
//       .json({ success: false, message: "Email and OTP are required" });
//     return;
//   }

//   try {
//     const otpRecord = await VerificationOTP.findOne({ email });

//     if (!otpRecord) {
//       res
//         .status(400)
//         .json({ success: false, message: "Verification Not Requested" });
//       return;
//     }

//     if (otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
//       res
//         .status(400)
//         .json({ success: false, message: "Invalid or expired OTP" });
//       return;
//     }

//     otpRecord.isVerified = true;
//     otpRecord.otp = "";
//     await otpRecord.save();

//     res
//       .status(200)
//       .json({ success: true, message: "OTP verified successfully" });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ success: false, message: "OTP verification failed" });
//   }
// };
