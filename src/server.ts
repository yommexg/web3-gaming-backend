import express from "express";
import path from "path";
import mongoose from "mongoose";

import { PORT } from "./config/env";
import connectDB from "./config/dbConnect";
import authRouter from "./routes/auth";
import { errorEvent, logEvent } from "./middlewares/events";

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(logEvent);

app.get("/", (_req, res) => {
  res.send("Welcome to Pocker APIs' Collection");
});

app.use("/api/auth", authRouter);

app.use(errorEvent);

mongoose.connection.once("open", () => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
});
