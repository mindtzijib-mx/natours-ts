import { Request, Response, NextFunction } from "express";
import multer from "multer";
import sharp from "sharp";
import User from "../models/user.model";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { getAll, getOne, updateOne, deleteOne } from "./handlerFactory";

// Multer configuration
const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile?: boolean) => void
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    if (!req.user) {
      return next(new AppError("You are not logged in!", 401));
    }

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

    next();
  }
);

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

export const getMyPhoto = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("You are not logged in!", 401));
    }

    const user = await User.findById(req.user.id).select("photo");

    if (!user) {
      return next(new AppError("User not found!", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        photo: user.photo,
      },
    });
  }
);

export const getUserPhoto = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { filename } = req.params;
    const path = require("path");
    const fs = require("fs");

    const imagePath = path.join(__dirname, "../../public/img/users", filename);

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return next(new AppError("Image not found!", 404));
    }

    // Set appropriate headers including CORS
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    // Send the file
    res.sendFile(imagePath);
  }
);

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
    if (req.file) filteredBody.photo = req.file.filename;

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
