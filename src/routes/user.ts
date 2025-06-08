import express from "express";

import { handleGetUserDetails } from "../controllers/users/get-user-details";

const userRouter = express.Router();

userRouter.get("/me", handleGetUserDetails);

export default userRouter;
