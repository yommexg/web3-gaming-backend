import { CorsOptions } from "cors";

import { FRONTEND_URL } from "./env";

const allowedOrigins = [FRONTEND_URL];

const isAllowedOrigin = (origin: string | undefined): boolean => {
  return allowedOrigins.includes(origin as string);
};

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

export default corsOptions;
