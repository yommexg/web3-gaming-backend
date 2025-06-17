import { FRONTEND_URL } from "../../config/env";
import transporter from "./transporter";

export const sendVerificationEmail = async (email: string, token: string) => {
  if (!email || !token) {
    throw new Error("Email, name, and token are required");
  }

  const url = `${FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: '" Yommex Genesis" <no-reply@yommexg.com>',
    to: email,
    subject: "Verify your  Yommex Genesis account",
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
          p {
            font-size: 16px;
            line-height: 1.6;
          }
          .verify-button {
            display: inline-block;
            margin: 20px 0;
            padding: 12px 20px;
            background-color: #30B943;
            color: #000;
            font-weight: bold;
            text-decoration: none;
            border-radius: 5px;
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
          <h1>Verify Your Email</h1>
          <p>Welcome to <strong> Yommex Genesis</strong> — the multigaming platform where NFT communities unite, compete, and have fun!</p>
          <p>To complete your registration, please verify your email address by clicking the button below:</p>
          <p style="text-align: center;">
            <a class="verify-button" href="${url}">Verify Email</a>
          </p>
          <p><strong>Note:</strong> This verification link will expire in <strong>5 minutes</strong> for your security.</p>
          <p>If you did not sign up for a  Yommex Genesis account, please ignore this message.</p>
  
          <div class="privacy">
            <p><strong>Privacy Notice:</strong> Your data is handled securely and in accordance with applicable data protection laws, including the GDPR. As the data controller,  Yommex Genesis ensures your privacy is protected when using our platform. For more information, please review our Privacy Policy.</p>
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
