import express from "express";
import {
  aliasTopTours,
  getAllTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} from "../controllers/tour.controller";
import { protect, restrictTo } from "../controllers/auth.controller";
import reviewRouter from "./review.routes";

const router = express.Router();

// router.param('id', tourController.checkID);

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
router.use("/:tourId/reviews", reviewRouter);

// Special routes
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/tour-stats").get(getTourStats);

router
  .route("/monthly-plan/:year")
  .get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route("/distances/:latlng/unit/:unit").get(getDistances);

// Main CRUD routes
router
  .route("/")
  .get(getAllTours)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);

router
  .route("/:id")
  .get(getTour)
  .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

export default router;
