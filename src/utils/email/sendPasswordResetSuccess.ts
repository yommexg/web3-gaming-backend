import transporter from "./transporter";

export const sendPasswordResetSuccessEmail = async (
  email: string,
  username: string
) => {
  if (!email || !username) {
    throw new Error("Email and username are required");
  }

  await transporter.sendMail({
    from: '"Crypto Oasis" <no-reply@lumina.com>',
    to: email,
    subject: `Hi ${username}, Your Password Has Been Successfully Reset`,
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
            color: #30B943;
            text-align: center;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            text-align: center;
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
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="cid:icon" alt="Crypto Oasis Logo" class="logo" width="120" />
          <h1>Password Reset Successful</h1>
          <p>Hello <strong>${username}</strong>,</p>
          <p>Your <strong>Crypto Oasis</strong> account password has been successfully reset.</p>
          <p>If this was you, there's nothing more to do.</p>
          <p>If you did not request this change, please contact our support team immediately.</p>

          <div class="privacy">
            <p><strong>Privacy Notice:</strong> We take your security seriously. If you suspect any unauthorized activity, please notify us right away.</p>
          </div>

          <div class="footer">
            — The Crypto Oasis Team<br />
            &copy; ${new Date().getFullYear()} Crypto Oasis
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
