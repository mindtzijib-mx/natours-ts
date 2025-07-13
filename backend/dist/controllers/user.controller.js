"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.deleteMe = exports.updateMe = exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el))
            newObj[el] = obj[el];
    });
    return newObj;
};
exports.getAllUsers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find();
    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
}));
exports.updateMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError_1.AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
    }
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    // 3) Update user document
    if (!req.user) {
        return next(new AppError_1.AppError('You are not logged in!', 401));
    }
    const updatedUser = yield user_model_1.default.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
}));
exports.deleteMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(new AppError_1.AppError('You are not logged in!', 401));
    }
    yield user_model_1.default.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null,
    });
}));
const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};
exports.getUser = getUser;
const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};
exports.createUser = createUser;
const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};
exports.updateUser = updateUser;
const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};
exports.deleteUser = deleteUser;
