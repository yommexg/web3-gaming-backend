import crypto from "crypto";

export const generateDeviceId = (
  fingerprint: string,
  userAgent: string,
  simplifiedIP: string
): string => {
  const raw = `${fingerprint}-${userAgent}-${simplifiedIP}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
};
