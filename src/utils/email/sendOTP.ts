import transporter from "./transporter";

export const sendForgotPasswordOTPEmail = async (
  email: string,
  otp: string
) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  await transporter.sendMail({
    from: '" Yommex Genesis" <no-reply@yommexg.com>',
    to: email,
    subject: "Reset Your  Yommex Genesis Password",
    html: `
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #ffffff;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            border: 1px solid #30B943;
          }
          .logo {
            display: block;
            margin: 0 auto 20px;
          }
          h1 {
            color: #CCE919;
            text-align: center;
          }
          .otp {
            font-size: 24px;
            font-weight: bold;
            background-color: #e0fbe0;
            padding: 10px 20px;
            text-align: center;
            border-radius: 5px;
            margin: 20px 0;
            display: inline-block;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
          }
          .footer {
            font-size: 13px;
            color: #777;
            margin-top: 40px;
            text-align: center;
          }
          .privacy {
            font-size: 12px;
            margin-top: 15px;
            color: #666;
            line-height: 1.4;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="cid:icon" alt=" Yommex Genesis Logo" class="logo" width="120" />
          <h1>Password Reset Request</h1>
          <p>We received a request to reset the password for your <strong> Yommex Genesis</strong> account.</p>
          <p>Use the following OTP to reset your password. This code will expire in <strong>5 minutes</strong>:</p>
          <div class="otp">${otp}</div>
          <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
          
          <div class="privacy">
            <p><strong>Privacy Notice:</strong> Your data is handled securely and in accordance with applicable data protection laws. For more information, please review our Privacy Policy.</p>
          </div>

          <div class="footer">
            — The  Yommex Genesis Team<br />
            &copy; ${new Date().getFullYear()}  Yommex Genesis
          </div>
        </div>
      </body>
    </html>
    `,
    attachments: [
      {
        filename: "icon.png",
        path: "./public/assets/icon.png",
        cid: "icon",
      },
    ],
  });
};
