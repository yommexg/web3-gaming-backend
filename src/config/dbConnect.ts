import mongoose from "mongoose";
import { DATABASE_URI } from "./env";

const connectDB = async (): Promise<void> => {
  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(DATABASE_URI);
    console.log("Database Connected Successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
