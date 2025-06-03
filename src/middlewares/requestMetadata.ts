import { format } from "date-fns";
import { Request, Response, NextFunction } from "express";

export const captureRequestMetadata = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get IP address (try to handle proxies)
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    typeof forwarded === "string"
      ? forwarded.split(",")[0]
      : req.socket.remoteAddress;

  // Get user agent
  const userAgent = req.headers["user-agent"];

  const dateTime = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`;

  console.log(`${dateTime} \t IP=${ip} \t UserAgent=${userAgent}`);

  //@ts-ignore
  req.metadata = {
    ip: ip || "unknown",
    userAgent: userAgent || "unknown",
  };

  next();
};
