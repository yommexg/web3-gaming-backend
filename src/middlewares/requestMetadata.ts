import { format } from "date-fns";
import { Request, Response, NextFunction } from "express";

import { UAParser } from "ua-parser-js";

export const captureRequestMetadata = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get IP address
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    typeof forwarded === "string"
      ? forwarded.split(",")[0].trim()
      : req.socket.remoteAddress || "unknown";

  const simplifyIP = (ip: string): string => {
    const segments = ip.split(".");
    return segments.length === 4 ? segments.slice(0, 3).join(".") : ip;
  };

  // Parse and normalize user-agent
  const rawUserAgent = req.headers["user-agent"] || "unknown";

  const parser = new UAParser(rawUserAgent);
  const parsed = parser.getResult();

  const normalizedUserAgent = `${parsed.os.name} ${parsed.os.version} - ${parsed.browser.name} ${parsed.browser.version}`;

  const dateTime = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`;
  console.log(`${dateTime} \t IP=${ip} \t UA=${normalizedUserAgent}`);

  //@ts-ignore
  req.metadata = {
    ip: simplifyIP(ip),
    userAgent: normalizedUserAgent,
  };

  next();
};
