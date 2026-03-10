import { analyzeResume } from "../services/resume.service.js";

export const analyzeResumeController = async (req, res) => {

    try {

        const { resume } = req.body;

        if (!resume) {
            return res.status(400).json({
                success: false,
                message: "Resume text is required"
            });
        }

        const result = await analyzeResume(resume);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error("Resume Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: "Resume analysis failed"
        });
    }
};