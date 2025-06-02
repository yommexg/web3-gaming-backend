import nodemailer, { Transporter } from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../../config/env";

const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export default transporter;
