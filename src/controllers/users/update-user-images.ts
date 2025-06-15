import { Request, Response } from "express";
import User from "../../models/User";
import { uploadUserImage } from "../../utils/aws/user-image";

export const handleUpdateUserImages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.user.userId;

    const files = req.files as {
      avatar?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    };

    if (
      (!files?.avatar || files.avatar.length === 0) &&
      (!files?.banner || files.banner.length === 0)
    ) {
      res.status(400).json({
        success: false,
        message: "At least one image (avatar or banner) is required.",
      });
      return;
    }

    const foundUser = await User.findById(userId).exec();
    if (!foundUser) {
      res.status(404).json({ success: false, message: "User Not Found" });
      return;
    }

    const username = foundUser.username;

    if (username && files.avatar && files.avatar.length > 0) {
      const avatarUrl = await uploadUserImage(
        "avatar",
        files.avatar[0],
        username
      );

      foundUser.avatarUrl = avatarUrl;
    }

    if (username && files.banner && files.banner.length > 0) {
      const bannerUrl = await uploadUserImage(
        "banner",
        files.banner[0],
        username
      );

      foundUser.bannerUrl = bannerUrl;
    }

    await foundUser.save();

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
    });
  } catch (error) {
    console.error("Error in Uploding User Images:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
