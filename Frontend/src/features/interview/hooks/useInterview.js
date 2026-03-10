import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
} from "../services/interview.api";

import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {

  const context = useContext(InterviewContext);
  const { interviewId } = useParams();

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports,
  } = context;

  /**
   * Generate report
   * mode: "analysis" | "full"
   */
  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
    mode = "full",
  }) => {

    setLoading(true);

    let response = null;

    try {

      response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
        mode,
      });

      if (response?.interviewReport) {
        setReport(response.interviewReport);
      }

    } catch (error) {

      console.log("Generate Report Error:", error);

    } finally {

      setLoading(false);

    }

    return response?.interviewReport;
  };

  /**
   * Get report by ID
   */
  const getReportById = async (interviewId) => {

    setLoading(true);

    let response = null;

    try {

      response = await getInterviewReportById(interviewId);

      if (response?.interviewReport) {
        setReport(response.interviewReport);
      }

    } catch (error) {

      console.log("Get Report Error:", error);

    } finally {

      setLoading(false);

    }

    return response?.interviewReport;
  };

  /**
   * Get all reports
   */
  const getReports = async () => {

    setLoading(true);

    let response = null;

    try {

      response = await getAllInterviewReports();

      if (response?.interviewReports) {
        setReports(response.interviewReports);
      }

    } catch (error) {

      console.log("Get Reports Error:", error);

    } finally {

      setLoading(false);

    }

    return response?.interviewReports;
  };

  /**
   * Download resume PDF
   */
  const getResumePdf = async (interviewReportId) => {

    setLoading(true);

    try {

      const response = await generateResumePdf({ interviewReportId });

      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" })
      );

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);

      document.body.appendChild(link);

      link.click();

    } catch (error) {

      console.log("Download Resume Error:", error);

    } finally {

      setLoading(false);

    }
  };

  /**
   * Auto fetch data
   */
  useEffect(() => {

    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }

  }, [interviewId]);

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
  };
};
