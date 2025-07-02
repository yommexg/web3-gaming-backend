import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || "5000";
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
export const DATABASE_URI = process.env.DATABASE_URI!;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID!;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY!;
export const AWS_REGION = process.env.AWS_REGION!;
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET!;
