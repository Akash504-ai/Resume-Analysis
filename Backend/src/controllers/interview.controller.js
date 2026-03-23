import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

import {
  generateInterviewReport,
  generateResumePdf,
} from "../services/ai.service.js";

import interviewReportModel from "../models/interviewReport.model.js";
import userModel from "../models/user.model.js";
import { decrypt } from "../utils/encryption.js";
import { analyzeResume } from "../services/resume.service.js";

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
  try {
    const { selfDescription, jobDescription, mode = "full" } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF is required.",
      });
    }

    /* ---------------- PARSE RESUME ---------------- */

    const pdf = await pdfjs.getDocument({
      data: new Uint8Array(req.file.buffer),
    }).promise;

    let resumeText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      resumeText += strings.join(" ") + " ";
    }

    /* ---------------- ML ANALYSIS ---------------- */

    let resumeAnalysis;

    try {
      resumeAnalysis = await analyzeResume(resumeText, jobDescription);
      console.log("Resume Analysis:", resumeAnalysis);
    } catch (error) {
      console.error("Resume ML Service Error:", error);

      // fallback instead of crash
      resumeAnalysis = {
        resume_skills: [],
        recommended_jobs: [],
        career_paths: [],
        skillGaps: [],
        live_jobs: [],
        job_match_score: 25,
      };
    }

    const matchScore = resumeAnalysis?.job_match_score || 25;

    /* ---------------- FREE MODE ---------------- */

    if (mode === "analysis") {
      const title =
        jobDescription?.split("\n")[0]?.slice(0, 60) ||
        "Resume Analysis Report";

      const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        title,
        resume: resumeText,
        selfDescription,
        jobDescription,

        resumeAnalysis: {
          resume_skills: resumeAnalysis.resume_skills || [],
          recommended_jobs: resumeAnalysis.recommended_jobs || [],
          career_paths: resumeAnalysis.career_paths || [],
        },

        skillGaps: resumeAnalysis.skillGaps || [],
        live_jobs: resumeAnalysis.live_jobs || resumeAnalysis.liveJobs || [],
        matchScore,
      });

      return res.status(201).json({
        message: "Resume analysis generated successfully.",
        interviewReport,
      });
    }

    /* ---------------- FULL MODE ---------------- */

    const user = await userModel.findById(req.user.id);

    if (!user || !user.grokApiKey) {
      return res.status(400).json({
        message: "Please add your Groq API key in Settings.",
      });
    }

    const apiKey = decrypt(user.grokApiKey);

    const interViewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
      resumeAnalysis,
      apiKey,
    });

    const title =
      jobDescription?.split("\n")[0]?.slice(0, 60) ||
      "Interview Strategy Report";

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      title,
      resume: resumeText,
      selfDescription,
      jobDescription,

      resumeAnalysis: {
        resume_skills: resumeAnalysis.resume_skills || [],
        recommended_jobs: resumeAnalysis.recommended_jobs || [],
        career_paths: resumeAnalysis.career_paths || [],
      },

      matchScore,

      skillGaps:
        interViewReportByAi.skillGaps || resumeAnalysis.skillGaps || [],

      technicalQuestions: interViewReportByAi.technicalQuestions || [],

      behavioralQuestions: interViewReportByAi.behavioralQuestions || [],

      preparationPlan: interViewReportByAi.preparationPlan || [],

      live_jobs: resumeAnalysis.live_jobs || resumeAnalysis.liveJobs || [],
    });

    res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    });
  } catch (error) {
    console.error("Generate Interview Report Error:", error);

    res.status(500).json({
      message: "Server error while generating interview report",
      error: error.message,
    });
  }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    res.status(200).json({
      message: "Interview report fetched successfully.",
      interviewReport,
    });
  } catch (error) {
    console.error("Get Interview Report Error:", error);

    res.status(500).json({
      message: "Server error while fetching interview report",
      error: error.message,
    });
  }
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );

  res.status(200).json({
    message: "Interview reports fetched successfully.",
    interviewReports,
  });
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params;

    const interviewReport =
      await interviewReportModel.findById(interviewReportId);

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;

    const user = await userModel.findById(req.user.id);

    if (!user || !user.grokApiKey) {
      return res.status(400).json({
        message: "Please add your Groq API key in Settings.",
      });
    }

    const apiKey = decrypt(user.grokApiKey);

    const pdfBuffer = await generateResumePdf({
      resume,
      jobDescription,
      selfDescription,
      apiKey,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Generate Resume PDF Error:", error);

    res.status(500).json({
      message: "Server error while generating resume PDF",
      error: error.message,
    });
  }
}

export default {
  generateInterViewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};
