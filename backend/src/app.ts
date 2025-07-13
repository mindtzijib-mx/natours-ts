// --------------------
// Core & Third-party Imports
// --------------------
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
const hpp = require("hpp");
const mongoSanitize = require("mongo-sanitize");
const xssSanitizer = require("express-xss-sanitizer");

// --------------------
// App-specific Imports (Routers, Controllers, Models, Utils)
// --------------------
import tourRouter from "./routes/tour.routes";
import userRouter from "./routes/user.routes";
import reviewRouter from "./routes/review.routes";
import { globalErrorHandler } from "./controllers/error.controller";
import { AppError } from "./utils/AppError";
import { IUser } from "./models/user.model";

// Extend the Request interface to include custom properties
declare global {
  namespace Express {
    interface Request {
      requestTime?: string;
      user?: IUser;
    }
  }
}

function sanitizeObject(obj: any) {
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      obj[key] = mongoSanitize(obj[key]);
    }
  }
}

const app = express();

// 1) GLOBAL MIDDLEWARES
// Enable CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-production-domain.com"]
        : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Set security HTTP headers
app.use(helmet());

// Data sanitization against NoSQL query injection
app.use((req: Request, res: Response, next: NextFunction) => {
  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);
  next();
});

// Data sanitization against XSS
app.use(xssSanitizer.xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// Limit requests from same API
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutos
  max: 100, // máximo 1000 requests por ventana de tiempo
  message: {
    error: "API rate limit exceeded, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "../public")));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Hello from the middleware 👋");
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//   const err = new AppError(
//     `Can't find ${req.originalUrl} on this server!`,
//     404
//   );
//   next(err);
// });

app.use(globalErrorHandler);

export default app;
