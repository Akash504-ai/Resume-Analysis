// import axios from "axios";

// const ML_API = process.env.ML_SERVICE_URL;

// export const analyzeResume = async (resumeText, jobDescription) => {
//   try {
//     const response = await axios.post(
//       `${ML_API}/analyze`,
//       {
//         resume: resumeText,
//         job_description: jobDescription || "",
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         timeout: 60000,
//       }
//     );

//     console.log("PYTHON RESPONSE:", response.data);

//     const mlData = response.data;

//     const detectedSkills = mlData?.resume_analysis?.detected_skills || [];
//     const careerPaths = mlData?.career_paths || [];
//     const recommendedJobs = mlData?.job_recommendations || [];
//     const jobMatchScore = mlData?.job_match_score || 0;

//     const missingSkillsSet = new Set();

//     recommendedJobs.forEach((job) => {
//       job?.missing_skills?.forEach((skill) => {
//         missingSkillsSet.add(skill);
//       });
//     });

//     const formattedSkillGaps = Array.from(missingSkillsSet).map((skill) => ({
//       skill: skill,
//       severity: "medium",
//     }));

//     return {
//       job_match_score: jobMatchScore,
//       resume_skills: detectedSkills,
//       career_paths: careerPaths,
//       recommended_jobs: recommendedJobs,
//       skillGaps: formattedSkillGaps,
//       live_jobs: mlData?.live_jobs || [],
//     };
//   } catch (error) {
//     console.error("ML Service Error:", error?.response?.data || error.message);

//     throw new Error("Resume analysis service failed");
//   }
// };



import axios from "axios";

const ML_API = process.env.ML_SERVICE_URL;

export const analyzeResume = async (resumeText, jobDescription) => {
  try {
    if (!ML_API) {
      throw new Error("ML_SERVICE_URL not configured");
    }

    // 🔥 1. Wake up ML server (important for Render free tier)
    try {
      await axios.get(ML_API);
    } catch (err) {
      console.log("ML wake-up ping failed (expected if sleeping)");
    }

    // 🔥 2. Main request
    const response = await axios.post(
      `${ML_API}/analyze`,
      {
        resume: resumeText.slice(0, 8000), // 🔥 prevent overload
        job_description: jobDescription || "",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 180000, // 🔥 3 minutes (important)
      }
    );

    console.log("PYTHON RESPONSE:", response.data);

    const mlData = response.data;

    const detectedSkills = mlData?.resume_analysis?.detected_skills || [];
    const careerPaths = mlData?.career_paths || [];
    const recommendedJobs = mlData?.job_recommendations || [];
    const jobMatchScore = mlData?.job_match_score ?? 0;

    const missingSkillsSet = new Set();

    recommendedJobs.forEach((job) => {
      job?.missing_skills?.forEach((skill) => {
        missingSkillsSet.add(skill);
      });
    });

    const formattedSkillGaps = Array.from(missingSkillsSet).map((skill) => ({
      skill,
      severity: "medium",
    }));

    return {
      job_match_score: jobMatchScore,
      resume_skills: detectedSkills,
      career_paths: careerPaths,
      recommended_jobs: recommendedJobs,
      skillGaps: formattedSkillGaps,
      live_jobs: mlData?.live_jobs || [],
    };

  } catch (error) {
    console.error("ML ERROR (1st try):", error?.response?.data || error.message);

    // 🔁 3. Retry once after delay (handles cold start)
    try {
      console.log("Retrying ML request in 10 seconds...");
      await new Promise((res) => setTimeout(res, 10000));

      const retry = await axios.post(`${ML_API}/analyze`, {
        resume: resumeText.slice(0, 8000),
        job_description: jobDescription || "",
      });

      const mlData = retry.data;

      return {
        job_match_score: mlData?.job_match_score ?? 0,
        resume_skills: mlData?.resume_analysis?.detected_skills || [],
        career_paths: mlData?.career_paths || [],
        recommended_jobs: mlData?.job_recommendations || [],
        skillGaps: [],
        live_jobs: mlData?.live_jobs || [],
      };

    } catch (err) {
      console.error("ML FINAL FAILURE:", err?.response?.data || err.message);

      // 🔥 4. SAFE FALLBACK (no crash, no fake 25%)
      return {
        job_match_score: 0,
        resume_skills: [],
        career_paths: [],
        recommended_jobs: [],
        skillGaps: [],
        live_jobs: [],
        failed: true, // 👈 optional flag for frontend
      };
    }
  }
};