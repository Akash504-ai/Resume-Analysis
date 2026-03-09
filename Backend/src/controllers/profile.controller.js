import profileModel from "../models/profile.model.js";
import userModel from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

// CREATE PROFILE
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


// GET PROFILE
export const getMyProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const user = await userModel.findById(userId).select("username email");

    const profile = await profileModel.findOne({ userId });

    res.status(200).json({
      user,
      profile
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const updatedProfile = await profileModel.findOneAndUpdate(
      { userId },
      req.body,
      { new: true }
    );

    res.status(200).json(updatedProfile);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {

    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded"
      });
    }

    const result = await cloudinary.uploader.upload_stream(
      { folder: "profile_images" },
      async (error, uploadResult) => {

        if (error) {
          return res.status(500).json({ message: "Upload failed" });
        }

        const profile = await profileModel.findOneAndUpdate(
          { userId },
          { profileImage: uploadResult.secure_url },
          { new: true }
        );

        res.status(200).json(profile);
      }
    );

    result.end(req.file.buffer);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};