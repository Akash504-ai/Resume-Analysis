import os
import pickle
import re
import requests
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer


# --------------------------------------------------
# FastAPI Configuration
# --------------------------------------------------

app = FastAPI(
    title="AI Resume Analyzer API",
    description="Analyze resumes, recommend jobs, detect skill gaps, and suggest career paths.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Request Model
# --------------------------------------------------

class ResumeRequest(BaseModel):
    resume: str
    job_description: str


# --------------------------------------------------
# Load ML Models
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_pickle(file_name):
    path = os.path.join(BASE_DIR, file_name)
    with open(path, "rb") as f:
        return pickle.load(f)

try:
    tfidf = load_pickle("tfidf_vectorizer.pkl")
    tfidf_matrix = load_pickle("tfidf_matrix.pkl")
    df = load_pickle("job_dataset.pkl")
    skill_list = load_pickle("skill_list.pkl")

except Exception as e:
    raise RuntimeError(f"Error loading ML models: {e}")


# --------------------------------------------------
# Text Cleaning
# --------------------------------------------------

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-zA-Z\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


# --------------------------------------------------
# Skill Extraction
# --------------------------------------------------

def extract_resume_skills(resume_text: str) -> List[str]:

    resume_lower = resume_text.lower()
    resume_skills = []

    for skill in skill_list:

        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, resume_lower):
            resume_skills.append(skill)

    return sorted(list(set(resume_skills)))


# --------------------------------------------------
# 🔴 NEW: Fetch Live Jobs from Adzuna API
# --------------------------------------------------

def fetch_real_jobs(role):

    APP_ID = "ca7c8266"
    APP_KEY = "d614f22e0aa5215b73470d6763899691"

    url = "https://api.adzuna.com/v1/api/jobs/in/search/1"

    params = {
        "app_id": APP_ID,
        "app_key": APP_KEY,
        "what": role,
        "results_per_page": 5
    }

    response = requests.get(url, params=params)

    jobs = []

    if response.status_code == 200:

        data = response.json()

        for job in data.get("results", []):

            jobs.append({
                "title": job.get("title"),
                "company": job.get("company", {}).get("display_name"),
                "location": job.get("location", {}).get("display_name"),
                "apply_link": job.get("redirect_url")
            })

    return jobs


# --------------------------------------------------
# Resume Analysis Logic
# --------------------------------------------------

def analyze_resume(resume_text: str, job_description: str):

    clean_resume = clean_text(resume_text)
    clean_job = clean_text(job_description)

    # --------------------------------------------------
    # Resume vs Job Description Score
    # --------------------------------------------------

    temp_vectorizer = TfidfVectorizer()

    vectors = temp_vectorizer.fit_transform([clean_resume, clean_job])

    text_similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]


    # --------------------------------------------------
    # Skill Overlap Score
    # --------------------------------------------------

    resume_skills = extract_resume_skills(resume_text)

    job_skills = []

    job_lower = job_description.lower()

    for skill in skill_list:

        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, job_lower):
            job_skills.append(skill)

    resume_set = set(resume_skills)
    job_set = set(job_skills)

    if len(job_set) > 0:
        skill_overlap = len(resume_set & job_set) / len(job_set)
    else:
        skill_overlap = 0


    # --------------------------------------------------
    # Final Score
    # --------------------------------------------------

    final_score = (0.5 * text_similarity) + (0.5 * skill_overlap)

    job_match_score = round(final_score * 100, 2)


    # --------------------------------------------------
    # Resume vs Dataset (Job Recommendation)
    # --------------------------------------------------

    resume_vector = tfidf.transform([clean_resume])

    similarity_scores = cosine_similarity(resume_vector, tfidf_matrix)


    # --------------------------------------------------
    # Job Recommendation Logic
    # --------------------------------------------------

    recommended_jobs = []
    seen_titles = set()

    for i in similarity_scores[0].argsort()[::-1]:

        job_title = df.iloc[i]["Job Title"]

        if job_title in seen_titles:
            continue

        seen_titles.add(job_title)

        score = float(similarity_scores[0][i]) * 100

        job_skill_text = str(df.iloc[i]["skills"]).lower()

        job_skills = []

        for skill in skill_list:

            pattern = r"\b" + re.escape(skill) + r"\b"

            if re.search(pattern, job_skill_text):
                job_skills.append(skill)

        job_skills = list(set(job_skills))

        matching_skills = sorted(list(set(resume_skills).intersection(job_skills)))

        missing_skills = sorted(list(set(job_skills) - set(resume_skills)))

        recommended_jobs.append({
            "job_title": job_title,
            "role": df.iloc[i]["Role"],
            "match_score": round(score, 2),
            "matching_skills": matching_skills,
            "missing_skills": missing_skills[:5]
        })

        if len(recommended_jobs) == 10:
            break


    # --------------------------------------------------
    # Career Paths
    # --------------------------------------------------

    career_paths = list(
        {job["role"] for job in recommended_jobs}
    )[:5]


    # --------------------------------------------------
    # 🔴 NEW: Fetch Live Jobs Based on Top Role
    # --------------------------------------------------

    live_jobs = []

    if recommended_jobs:

        top_role = recommended_jobs[0]["job_title"]

        live_jobs = fetch_real_jobs(top_role)


    # --------------------------------------------------
    # Final Response
    # --------------------------------------------------

    return {
        "job_match_score": job_match_score,
        "resume_analysis": {
            "detected_skills": resume_skills
        },
        "job_recommendations": recommended_jobs,
        "career_paths": career_paths,
        "live_jobs": live_jobs   # 🔴 Added
    }


# --------------------------------------------------
# API Endpoint
# --------------------------------------------------

@app.post("/analyze")
def analyze(data: ResumeRequest):

    try:
        return analyze_resume(data.resume, data.job_description)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/")
def health_check():
    return {"status": "Resume Analyzer API is running"}


# --------------------------------------------------
# Local Test
# --------------------------------------------------

if __name__ == "__main__":

    sample_resume = """
    Python developer with experience in machine learning,
    pandas, SQL, data analysis and predictive modeling
    """

    sample_jd = """
    Looking for a data scientist skilled in Python, SQL,
    machine learning, data analysis, and predictive modeling.
    """

    print(analyze_resume(sample_resume, sample_jd))


# Run server:
# uvicorn app:app --reload --port 8000