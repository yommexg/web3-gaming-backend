import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";

const multerError = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof MulterError) {
    const messageMap: Record<string, string> = {
      LIMIT_FILE_SIZE: "File is too large",
      LIMIT_FILE_COUNT: "File limit reached",
      LIMIT_FIELD_KEY: "Wrong file name",
      LIMIT_UNEXPECTED_FILE: "File must be an image / Enter the right key",
    };

    res.status(400).json({
      success: false,
      message: messageMap[error.code] || "Multer error",
    });

    return; // Prevent calling next() after response
  }

  next(error);
};

export default multerError;
