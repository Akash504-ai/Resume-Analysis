import profileModel from "../models/profile.model.js";
import userModel from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

/* ---------------- CREATE PROFILE ---------------- */

export const createProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const {
      bio,
      targetRole,
      skills,
      github,
      codingProfiles
    } = req.body;

    const existingProfile = await profileModel.findOne({ userId });

    if (existingProfile) {
      return res.status(400).json({
        message: "Profile already exists"
      });
    }

    const profile = await profileModel.create({
      userId,
      bio,
      targetRole,
      skills,
      github,
      codingProfiles
    });

    res.status(201).json(profile);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ---------------- GET MY PROFILE ---------------- */

export const getMyProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const user = await userModel
      .findById(userId)
      .select("username email");

    const profile = await profileModel.findOne({ userId });

    res.status(200).json({
      user,
      profile
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ---------------- UPDATE PROFILE ---------------- */

export const updateProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const {
      bio,
      targetRole,
      skills,
      github,
      codingProfiles
    } = req.body;

    /* ----- Basic Validation ----- */

    if (github && !github.includes("github.com")) {
      return res.status(400).json({
        message: "Invalid GitHub URL"
      });
    }

    if (
      codingProfiles?.leetcode &&
      !codingProfiles.leetcode.includes("leetcode.com")
    ) {
      return res.status(400).json({
        message: "Invalid LeetCode URL"
      });
    }

    /* ----- Update or Create Profile ----- */

    const updatedProfile = await profileModel.findOneAndUpdate(
      { userId },
      {
        bio,
        targetRole,
        skills,
        github,
        codingProfiles
      },
      {
        new: true,
        upsert: true,           // ⭐ creates profile if missing
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json(updatedProfile);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ---------------- UPLOAD PROFILE IMAGE ---------------- */

export const uploadProfileImage = async (req, res) => {
  try {

    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded"
      });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "profile_images" },

      async (error, uploadResult) => {

        if (error) {
          return res.status(500).json({
            message: "Image upload failed"
          });
        }

        const profile = await profileModel.findOneAndUpdate(
          { userId },
          { profileImage: uploadResult.secure_url },
          {
            new: true,
            upsert: true
          }
        );

        res.status(200).json(profile);
      }
    );

    stream.end(req.file.buffer);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};