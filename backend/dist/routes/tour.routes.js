"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tour_controller_1 = require("../controllers/tour.controller");
const router = (0, express_1.Router)();
router.route("/top-5-cheap").get(tour_controller_1.aliasTopTours, tour_controller_1.getAllTours);
router.route("/tour-stats").get(tour_controller_1.getTourStats);
router.route("/monthly-plan/:year").get(tour_controller_1.getMonthlyPlan);
router.route("/").get(tour_controller_1.getAllTours).post(tour_controller_1.createTour);
router.route("/:id").get(tour_controller_1.getTour).patch(tour_controller_1.updateTour).delete(tour_controller_1.deleteTour);
exports.default = router;
