import { Request, Response, NextFunction } from "express";
import Tour from "../models/tour.model";
import APIFeatures from "../utils/APIFeatures";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "./handlerFactory";

// Factory functions
export const getAllTours = getAll(Tour);
export const createTour = createOne(Tour);
export const updateTour = updateOne(Tour);
export const deleteTour = deleteOne(Tour);

// Custom function to get tour by slug
export const getTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findOne({ slug: req.params.id }).populate({
      path: "reviews",
      select: "-__v",
    });

    if (!tour) {
      return next(new AppError("No tour found with that slug", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: tour,
      },
    });
  }
);

// Special functions (not in factory)
export const aliasTopTours = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

export const getTourStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  }
);

export const getMonthlyPlan = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const year = Number(req.params.year); // 2021

    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
  }
);

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
export const getToursWithin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");

    const radius =
      unit === "mi" ? Number(distance) / 3963.2 : Number(distance) / 6378.1;

    if (!lat || !lng) {
      return next(
        new AppError(
          "Please provide latitude and longitude in the format lat,lng.",
          400
        )
      );
    }

    const tours = await Tour.find({
      startLocation: {
        $geoWithin: { $centerSphere: [[Number(lng), Number(lat)], radius] },
      },
    });

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        data: tours,
      },
    });
  }
);

export const getDistances = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");

    const multiplier = unit === "mi" ? 0.000621371 : 0.001;

    if (!lat || !lng) {
      return next(
        new AppError(
          "Please provide latitude and longitude in the format lat,lng.",
          400
        )
      );
    }

    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          distanceField: "distance",
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        data: distances,
      },
    });
  }
);
