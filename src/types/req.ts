import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

export interface MetadataRequest extends Request {
  metadata: {
    ip: string;
    userAgent: string;
  };
}
