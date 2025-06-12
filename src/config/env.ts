import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || "5000";
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const FRONTEND_URL =
  process.env.PRO_FRONTEND_URL || "http://localhost:5173";
export const DATABASE_URI = process.env.DATABASE_URI!;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const MORALIS_API_KEY = process.env.MORALIS_API_KEY!;
