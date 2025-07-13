"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const tour_routes_1 = __importDefault(require("./routes/tour.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const error_controller_1 = require("./controllers/error.controller");
const app = (0, express_1.default)();
// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use((req, res, next) => {
    console.log("Hello from the middleware 👋");
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
// 3) ROUTES
app.use("/api/v1/tours", tour_routes_1.default);
app.use("/api/v1/users", user_routes_1.default);
// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//   const err = new AppError(
//     `Can't find ${req.originalUrl} on this server!`,
//     404
//   );
//   next(err);
// });
app.use(error_controller_1.globalErrorHandler);
exports.default = app;
