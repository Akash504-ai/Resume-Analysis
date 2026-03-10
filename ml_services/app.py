import pickle
import re
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ResumeRequest(BaseModel):
    resume: str

# -------------------------------
# Load trained models
# -------------------------------

with open("tfidf_vectorizer.pkl", "rb") as f:
    tfidf = pickle.load(f)

with open("tfidf_matrix.pkl", "rb") as f:
    tfidf_matrix = pickle.load(f)

with open("job_dataset.pkl", "rb") as f:
    df = pickle.load(f)

with open("skill_list.pkl", "rb") as f:
    skill_list = pickle.load(f)


# -------------------------------
# Text cleaning
# -------------------------------

def clean_text(text):

    text = text.lower()

    text = re.sub(r'[^a-zA-Z\s]', '', text)

    return text


# -------------------------------
# Extract skills from resume
# -------------------------------

def extract_resume_skills(resume_text):

    resume_lower = resume_text.lower()

    resume_skills = []

    for skill in skill_list:
        if skill in resume_lower:
            resume_skills.append(skill)

    return list(set(resume_skills))


# -------------------------------
# Resume Analyzer
# -------------------------------

def analyze_resume(resume_text):

    clean_resume = clean_text(resume_text)

    resume_vector = tfidf.transform([clean_resume])

    similarity_scores = cosine_similarity(resume_vector, tfidf_matrix)

    top_indices = similarity_scores[0].argsort()[-5:][::-1]

    resume_skills = extract_resume_skills(resume_text)

    results = []

    for i in top_indices:

        score = similarity_scores[0][i] * 100

        job_skill_text = df.iloc[i]["skills"].lower()

        job_skills = []

        for skill in skill_list:
            if skill in job_skill_text:
                job_skills.append(skill)

        job_skills = list(set(job_skills))

        matching_skills = list(set(resume_skills).intersection(job_skills))

        missing_skills = list(set(job_skills) - set(resume_skills))

        results.append({
            "job_title": df.iloc[i]["Job Title"],
            "role": df.iloc[i]["Role"],
            "match_score": round(score, 2),
            "matching_skills": matching_skills,
            "missing_skills": missing_skills
        })

    career_paths = list(df.iloc[top_indices]["Role"].unique())

    return {
        "resume_skills": resume_skills,
        "recommended_jobs": results,
        "career_paths": career_paths
    }


# -------------------------------
# Optional local test
# -------------------------------

if __name__ == "__main__":

    resume = """
    Python developer with experience in machine learning,
    pandas, SQL, data analysis and predictive modeling
    """

    result = analyze_resume(resume)

    print(result)


@app.post("/analyze")
def analyze(data: ResumeRequest):

    result = analyze_resume(data.resume)

    return result


# uvicorn app:app --reload --port 8000