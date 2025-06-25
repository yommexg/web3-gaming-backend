import { Response } from "express";
import User from "../../models/User";
import { isUsernameValid } from "../../utils/regex";
import { AuthenticatedRequest } from "../../types/req";

export const handleUpdateUserInfo = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.userId;

    if (!req.body) {
      res
        .status(400)
        .json({ success: false, message: "No Request Body found" });
      return;
    }

    const { username, bio, XUrl, discordUrl, websiteUrl } = req.body;

    if (!username) {
      res.status(400).json({ success: false, message: "Username is required" });
      return;
    }

    if (!isUsernameValid(username)) {
      res.status(400).json({
        success: false,
        message:
          "Invalid username format. Use 3–30 alphanumeric characters or underscores.",
      });
      return;
    }

    const existingWithSameUsername = await User.findOne({
      username: username.toLowerCase(),
      _id: { $ne: userId },
    });

    if (existingWithSameUsername) {
      res.status(409).json({
        success: false,
        message: "Username already taken",
      });
      return;
    }

    if (bio && bio.length > 300) {
      res.status(400).json({
        success: false,
        message: "Bio must be 300 characters or less.",
      });
      return;
    }

    const xRegex = /^https?:\/\/(www\.)?x\.com\/[A-Za-z0-9_]{1,15}$/;
    const discordRegex =
      /^https?:\/\/(discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9]+$/;
    const websiteRegex = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;

    if (XUrl && !xRegex.test(XUrl)) {
      res.status(400).json({ success: false, message: "Invalid Twitter URL" });
      return;
    }

    if (discordUrl && !discordRegex.test(discordUrl)) {
      res.status(400).json({ success: false, message: "Invalid Discord URL" });
      return;
    }

    if (websiteUrl && !websiteRegex.test(websiteUrl)) {
      res.status(400).json({ success: false, message: "Invalid website URL" });
      return;
    }

    const foundUser = await User.findById(userId).exec();
    if (!foundUser) {
      res.status(404).json({ success: false, message: "User Not Found" });
      return;
    }

    foundUser.username = username;
    foundUser.bio = bio;
    foundUser.XUrl = XUrl;
    foundUser.discordUrl = discordUrl;
    foundUser.websiteUrl = websiteUrl;

    await foundUser.save();

    res.status(200).json({
      success: true,
      message: "User info updated successfully",
    });
  } catch (error) {
    console.error("Error in handleUpdateUsernameBioSocialLinks:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
