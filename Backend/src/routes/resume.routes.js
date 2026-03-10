const axios = require("axios");

const analyzeResume = async (resumeText) => {

    try {

        const response = await axios.post(
            "http://127.0.0.1:8000/analyze",
            {
                resume: resumeText
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;

    } catch (error) {

        console.error("ML Service Error:", error.message);

        throw new Error("Resume analysis service failed");
    }
};

module.exports = {
    analyzeResume
};