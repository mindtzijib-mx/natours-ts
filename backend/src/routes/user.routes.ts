import express from "express";
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  restrictTo,
  signup,
  updatePassword,
} from "../controllers/auth.controller";
import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getMe,
  getMyPhoto,
  getUser,
  getUserPhoto,
  resizeUserPhoto,
  updateMe,
  updateUser,
  uploadUserPhoto,
} from "../controllers/user.controller";

const router = express.Router();

// Authentication routes (public)
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// Public route for serving user photos
router.get("/photo/:filename", getUserPhoto);

// Apply protect middleware to all routes below this point
router.use(protect);

// Protected user routes (require authentication)
router.patch("/updateMyPassword", updatePassword);
router.get("/me", getMe, getUser);
router.get("/me/photo", getMyPhoto);
router.patch("/updateMe", uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete("/deleteMe", deleteMe);

router.use(restrictTo("admin"));

// Admin routes (require authentication + admin privileges)
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
