"use strict";
// src/models/tour.model.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
// 2. Create a Schema corresponding to the document interface.
const tourSchema = new mongoose_1.Schema({
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
            validator: function (val) {
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// VIRTUAL PROPERTIES
tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
});
// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre("save", function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});
tourSchema.post(/^find/, function (docs, next) {
    if (this.start) {
        console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    }
    next();
});
// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    console.log(this.pipeline());
    next();
});
// 3. Create a Model.
const Tour = mongoose_1.default.model("Tour", tourSchema);
exports.default = Tour;
