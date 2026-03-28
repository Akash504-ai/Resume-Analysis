# ML Service – Resume Analyzer & Moderation API

This microservice is responsible for all machine learning capabilities in the platform, including resume analysis, job recommendations, and real-time message moderation.

It is built using FastAPI and deployed as an independent service to ensure scalability and modularity.

---

## Overview

The ML service processes user inputs such as resumes and chat messages, applies trained machine learning models, and returns structured insights used across the application.

### Responsibilities

- Resume parsing and analysis
- Job recommendation based on dataset similarity
- Skill extraction and gap detection
- Toxic message detection
- Spam message classification

---

## Core Features

### Resume Analysis

- TF-IDF based vectorization of resume and job description
- Cosine similarity scoring for compatibility
- Extraction of relevant skills from resume text
- Identification of missing skills compared to job description
- Generation of structured analysis output

---

### Job Recommendation System

- Uses a preprocessed job dataset
- Matches resumes with similar job roles
- Provides relevant job suggestions
- Integrates external job APIs (Adzuna) for live listings

---

### Message Moderation System

#### Spam Detection

- Model: Naive Bayes
- Vectorization: TF-IDF
- Purpose: Detect unwanted or promotional messages

#### Toxicity Detection

- Model: Logistic Regression
- Purpose: Identify harmful, abusive, or inappropriate content

---

## Model Architecture

### Models Used

- job_dataset.pkl → Preprocessed dataset for job matching
- toxic_model.pkl → Toxicity classification model
- spam_model.pkl → Spam classification model
- tfidf_vectorizer copy.pkl → Vectorizer for resume analysis
- spam_vectorizer.pkl → Vectorizer for spam detection

---

## Model Hosting Strategy

Due to GitHub file size limitations, trained models are not stored in the repository.

Instead, they are hosted on Hugging Face Hub and downloaded dynamically during runtime.

### Benefits

- Keeps repository lightweight
- Avoids large file issues (>100MB)
- Enables easy model updates without redeploying backend
- Supports scalable deployment

---

## Model Loading Mechanism

Models are fetched at runtime using a helper function:

```python
download_file(HF_URL, "filename.pkl")
```

### Key Notes
- Ensure correct Hugging Face URL format:
    - Use `/resolve/main/`
    - Do NOT use `/blob/`
- Encode spaces in filenames:
    - Example: `tfidf_vectorizer%20copy.pkl`
 
---

## Message Moderation

  `POST /moderate`

### Request:
```python
{
  "text": "User message"
}
```
### Response includes:

- Spam classification
- Toxicity classification

---

## Deployment Configuration

### Platform

`Render` (Cloud Deployment)

### Settings

Root Directory: `ml_services`

### Build Command

```python
pip install -r requirements.txt
```

### Start Command

```python
uvicorn app:app --host 0.0.0.0 --port 10000
```

---

### Local Development

Run the service locally:
```python
uvicorn app:app --reload --port 80004
```

---

## Environment Variables

Sensitive keys should not be hardcoded.

Use environment variables:

`ADZUNA_APP_ID`
`ADZUNA_APP_KEY`

## ML Pipeline

1. Data collection and preprocessing
2. Text cleaning and normalization
3. Feature extraction using TF-IDF
4. Model training and evaluation
5. Model serialization using pickle (.pkl)
6. Deployment via FastAPI
7. Runtime inference through API endpoints

---

## System Architecture

<div align="center">
  <img width="436" height="252" alt="System Architecture" src="https://github.com/user-attachments/assets/93aa4299-14a7-40e8-b984-3da1ff86674d" />
</div>

---

## Design Decisions

### Microservice Architecture

The ML logic is separated from the main backend to:

- Improve scalability
- Allow independent deployment
- Reduce backend complexity
- External Model Hosting

### Using Hugging Face allows:

- Faster deployments
- Centralized model management
- Easy version control for models

---

## Limitations

- Initial request may be slower due to model download
- No caching implemented yet
- Basic models (can be improved with deep learning)

---

## Future Improvements

- Lazy loading for faster startup
- Redis caching for predictions
- Docker containerization
- Model versioning system
- Rate limiting and authentication
- Advanced NLP models (transformers)

---

## Status

- Production-ready
- Fully deployed
- Integrated with frontend and backend
- Actively maintained
