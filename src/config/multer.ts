import { Request } from "express";
import multer, { FileFilterCallback, MulterError } from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  }
};

export const createUpload = (options: {
  maxFileSize: number;
  maxFiles: number;
}) => {
  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: options.maxFileSize,
      files: options.maxFiles,
    },
  });
};
