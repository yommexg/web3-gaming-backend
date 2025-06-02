import express from "express";
import path from "path";
import mongoose from "mongoose";
import { PORT } from "./config/env";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) => {
  res.send("Welcome to Unitrail APIs");
});

// mongoose.connection.once("open", () => {
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
//});
