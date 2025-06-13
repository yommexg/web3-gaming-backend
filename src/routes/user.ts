import express from "express";

import { createUpload } from "../config/multer";

import { handleGetUserDetails } from "../controllers/users/get-user-details";
import { handleUpdateUserImages } from "../controllers/users/update-user-images";
import { handleUpdateUserInfo } from "../controllers/users/update-user-info";

const userRouter = express.Router();

userRouter.get("/me", handleGetUserDetails);

userRouter.post(
  "/upload-user-images",
  createUpload({ maxFiles: 2, maxFileSize: 10 * 1024 * 1024 }).fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  handleUpdateUserImages
);

userRouter.patch("/update-info", handleUpdateUserInfo);

export default userRouter;
