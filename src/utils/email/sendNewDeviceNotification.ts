import transporter from "./transporter";

export const sendNewDeviceNotification = async (
  email: string,
  ip: string,
  userAgent: string
) => {
  await transporter.sendMail({
    from: '"Crypto Oasis Security" <no-reply@lumina.com>',
    to: email,
    subject: "🔐 New Login Detected on Your Account",
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
            h2 {
              color: #CCE919;
              text-align: center;
            }
            .details {
              font-size: 16px;
              line-height: 1.6;
              margin: 20px 0;
            }
            .cta {
              display: inline-block;
              padding: 12px 20px;
              background-color: #30B943;
              color: #000;
              font-weight: bold;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
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
            <img src="cid:icon" alt="Crypto Oasis Logo" class="logo" width="100" />
            <h2>New Login Detected</h2>
            <p class="details">
              We've detected a new login to your <strong>Crypto Oasis</strong> account:
            </p>
            <ul class="details">
              <li><strong>IP Address:</strong> ${ip}</li>
              <li><strong>Device:</strong> ${userAgent}</li>
              <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
            </ul>
            <p class="details">
              If this was not you, please secure your account immediately.
            </p>
            <div style="text-align: center;">
              <a class="cta" href="${
                process.env.FRONTEND_URL
              }/reset-password">Reset Password</a>
            </div>
            <div class="footer">
              — The Crypto Oasis Security Team<br />
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
