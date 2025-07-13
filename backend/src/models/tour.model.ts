// src/models/tour.model.ts

import mongoose, { Schema, Document, Model, Query, Aggregate } from "mongoose";
import slugify from "slugify";
// import validator from 'validator';
import { IUser } from "./user.model";

// 1. Create an interface representing a document in MongoDB.
export interface ITour extends Document {
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: "easy" | "medium" | "difficult";
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount?: number; // Optional property
  summary: string;
  description?: string; // Optional property
  imageCover: string;
  images: string[];
  createdAt: Date;
  startDates: Date[];
  secretTour: boolean;
  durationWeeks: number; // For the virtual property
  startLocation: ILocation;
  locations: ILocation[];
  guides: (mongoose.Types.ObjectId | IUser)[];
}

// Interfaz auxiliar para localizaciones
export interface ILocation {
  type: "Point";
  coordinates: number[];
  address?: string;
  description?: string;
  day?: number;
}

// Interface for the Query helper to type 'this' in query middleware
interface ITourQuery extends Query<ITour[], ITour> {
  start?: number;
}

// 2. Create a Schema corresponding to the document interface.
const tourSchema = new Schema<ITour>(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal then 40 characters"],
      minlength: [10, "A tour name must have more or equal then 10 characters"],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val: number) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // IMPORTANT: In TypeScript, you must explicitly type 'this' in validator functions if you need to access other document properties.
        validator: function (this: ITour, val: number): boolean {
          // 'this' only points to current doc on NEW document creation
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

// VIRTUAL PROPERTIES
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre<ITour>("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE
tourSchema.pre<ITourQuery>(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (this: Query<any, any>, next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});

tourSchema.post<ITourQuery>(/^find/, function (docs, next) {
  if (this.start) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  }
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (this: Aggregate<any>, next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

// 3. Create a Model.
const Tour = mongoose.model<ITour>("Tour", tourSchema);

export default Tour;
