"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError_1.AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    var _a, _b;
    const value = (_b = (_a = err.errmsg) === null || _a === void 0 ? void 0 : _a.match(/(["'])(\\?.)*?\1/)) === null || _b === void 0 ? void 0 : _b[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError_1.AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError_1.AppError(message, 400);
};
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    // Errores operacionales confiables: enviar mensaje al cliente
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        // Error de programación: no revelar detalles al cliente
        console.error("ERROR 💥", err);
        res.status(500).json({
            status: "error",
            message: "Something went wrong!",
        });
    }
};
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    }
    else {
        let error = Object.assign({}, err);
        error.message = err.message;
        if (error.name === "CastError")
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.name === "ValidationError")
            error = handleValidationErrorDB(error);
        sendErrorProd(error, res);
    }
};
exports.globalErrorHandler = globalErrorHandler;
