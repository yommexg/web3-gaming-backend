import { FRONTEND_URL } from "../../config/env";
import transporter from "./transporter";

export const sendWelcomeEmail = async (email: string, username: string) => {
  if (!email || !username) {
    throw new Error("Email and username are required");
  }

  await transporter.sendMail({
    from: '" Yommex Genesis" <no-reply@yommexg.com>',
    to: email,
    subject: `Welcome to  Yommex Genesis, ${username}!`,
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
            text-align: center;
          }
          .cta-button {
            display: inline-block;
            margin: 20px auto;
            padding: 12px 20px;
            background-color: #30B943;
            color: #000;
            font-weight: bold;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
          }
          .footer {
            font-size: 13px;
            color: #777;
            margin-top: 40px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="cid:icon" alt=" Yommex Genesis Logo" class="logo" width="120" />
          <h1>Welcome, ${username}!</h1>
          <p>You've successfully verified and registered your account. 🎉</p>
          <p>Welcome to <strong> Yommex Genesis</strong> — where the multigaming NFT universe comes alive!</p>
          <p>Explore exciting games, compete in tournaments, and connect with vibrant NFT communities.</p>
          <p>
            <a href="${FRONTEND_URL}" class="cta-button">Start Exploring</a>
          </p>
          <p>We're thrilled to have you with us!</p>

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
