import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

/**
 * Generate interview report
 * mode:
 *  - "analysis" → free resume analysis
 *  - "full" → full AI strategy (requires API key)
 */
export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
  mode = "full",
}) => {
  try {
    const formData = new FormData();

    formData.append("jobDescription", jobDescription || "");
    formData.append("selfDescription", selfDescription || "");

    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    // NEW: mode flag for backend
    formData.append("mode", mode);

    const response = await api.post("/api/interview/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Generate Interview Report Error:", error?.response?.data || error.message);
    throw error;
  }
};
/**
 * Generate interview report
 */

/**
 * Get interview report by ID
 */
export const getInterviewReportById = async (interviewId) => {
  try {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Get Interview Report Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Get all interview reports of the user
 */
export const getAllInterviewReports = async () => {
  try {
    const response = await api.get("/api/interview/");
    return response.data;
  } catch (error) {
    console.error(
      "Get All Interview Reports Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Download generated resume PDF
 */
export const generateResumePdf = async ({ interviewReportId }) => {
  try {
    const response = await api.post(
      `/api/interview/resume/pdf/${interviewReportId}`,
      null,
      {
        responseType: "blob",
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      "Generate Resume PDF Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};
