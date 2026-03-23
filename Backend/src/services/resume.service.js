import axios from "axios";

export const analyzeResume = async (resumeText, jobDescription) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/analyze",
      {
        resume: resumeText,
        job_description: jobDescription || "",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("PYTHON RESPONSE:", response.data)

    const mlData = response.data;

    const detectedSkills = mlData?.resume_analysis?.detected_skills || [];

    const careerPaths = mlData?.career_paths || [];

    const recommendedJobs = mlData?.job_recommendations || [];

    const jobMatchScore = mlData?.job_match_score || 0;

    const missingSkillsSet = new Set();

    recommendedJobs.forEach((job) => {
      job?.missing_skills?.forEach((skill) => {
        missingSkillsSet.add(skill);
      });
    });

    const formattedSkillGaps = Array.from(missingSkillsSet).map((skill) => ({
      skill: skill,
      severity: "medium",
    }));

    return {
      job_match_score: jobMatchScore,
      resume_skills: detectedSkills,
      career_paths: careerPaths,
      recommended_jobs: recommendedJobs,
      skillGaps: formattedSkillGaps,
      live_jobs: mlData?.live_jobs || []
    };
  } catch (error) {
    console.error("ML Service Error:", error?.response?.data || error.message);

    throw new Error("Resume analysis service failed");
  }
};
