import { Request, Response, NextFunction } from "express";
import Review from "../models/review.model";
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "./handlerFactory";

export const setTourUserIds = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user?.id;
  next();
};

export const getAllReviews = getAll(Review);
export const getReview = getOne(Review);
export const createReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
