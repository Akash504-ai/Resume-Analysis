import userModel from "../models/user.model.js";
import { encrypt } from "../utils/encryption.js";

/*
    Save Grok API Key
*/
export const saveGrokApiKey = async (req, res) => {
  try {

    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: "API key is required",
      });
    }

    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔐 encrypt before saving
    const encryptedKey = encrypt(apiKey);

    user.grokApiKey = encryptedKey;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Grok API key saved successfully",
    });

  } catch (error) {

    console.error("Save API Key Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while saving API key",
    });

  }
};