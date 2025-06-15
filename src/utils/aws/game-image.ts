import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

import { AWS_REGION, AWS_S3_BUCKET } from "../../config/env";

interface File {
  originalname: string;
  buffer: Buffer;
}

export const uploadGameImage = async (
  file: File,
  gamename: string
): Promise<string> => {
  const s3Client = new S3Client({
    region: AWS_REGION,
  });

  const param = {
    Bucket: AWS_S3_BUCKET,
    Key: `games/${uuid()}-${gamename}-${file.originalname}`,
    Body: file.buffer,
  };

  try {
    const command = new PutObjectCommand(param);
    await s3Client.send(command);

    const url = `https://s3.${AWS_REGION}.amazonaws.com/${AWS_S3_BUCKET}/${param.Key}`;
    return url;
  } catch (err) {
    console.error("Error uploading avatar:", err);
    throw err;
  }
};
