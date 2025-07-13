import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { getAll, getOne, updateOne, deleteOne } from "./handlerFactory";

const filterObj = (obj: any, ...allowedFields: string[]) => {
  const newObj: { [key: string]: any } = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  req.params.id = req.user?.id;
  next();
};

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "name", "email");

    // 3) Update user document
    if (!req.user) {
      return next(new AppError("You are not logged in!", 401));
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

export const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("You are not logged in!", 401));
    }
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

export const getAllUsers = getAll(User);
export const getUser = getOne(User);

// Do NOT update passwords with this!
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
