import express from "express";
import authUser from "../middlewares/auth.middleware.js";
import {
  createProfile,
  getMyProfile,
  updateProfile,
  uploadProfileImage,
} from "../controllers/profile.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/create", authUser, createProfile);
router.get("/me", authUser, getMyProfile);
router.put("/update", authUser, updateProfile);
router.post(
  "/upload-image",
  authUser,
  upload.single("profileImage"),
  uploadProfileImage,
);

export default router;
