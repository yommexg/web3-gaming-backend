import transporter from "./transporter";

export const sendNewDeviceOTP = async (
  email: string,
  otp: string,
  ip: string,
  userAgent: string
) => {
  await transporter.sendMail({
    from: '" Yommex Genesis Security" <no-reply@yommexg.com>',
    to: email,
    subject: "Verify New Device with OTP",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <img src="cid:icon" alt=" Yommex Genesis Logo" style="width: 100px; display: block; margin: auto;" />
          <h2 style="text-align: center; color: #30B943;">New Device Login Verification</h2>
          <p>We've detected a login attempt from a new device or IP:</p>
          <ul>
            <li><strong>IP:</strong> ${ip}</li>
            <li><strong>Device:</strong> ${userAgent}</li>
          </ul>
          <p>Use the OTP below to verify and complete your login:</p>
          <div style="text-align: center; font-size: 24px; font-weight: bold; background: #e0fbe0; padding: 15px; border-radius: 5px;">
            ${otp}
          </div>
          <p>This OTP is valid for 5 minutes. If this wasn't you, please change your password immediately.</p>
          <p style="text-align: center; color: #999;">— The  Yommex Genesis Team</p>
        </div>
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
