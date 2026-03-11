import cloudinary from "../config/cloudinary.js";

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const isPdf = file.mimetype === "application/pdf";

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: isPdf ? "raw" : "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      stream.end(file.buffer);
    });

    res.json({
      url: result.secure_url,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ error: "Upload failed" });
  }
};
