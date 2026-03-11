import cloudinary from "../config/cloudinary.js";

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;

    const isPdf = file.mimetype === "application/pdf";

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: isPdf ? "raw" : "image"
    });

    res.json({
      url: result.secure_url
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
};