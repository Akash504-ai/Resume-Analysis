![Banner](./assets/banner.png.png)

<br/>

![License](https://img.shields.io/badge/license-MIT-green)
![Tech](https://img.shields.io/badge/stack-MERN-blue)
![AI](https://img.shields.io/badge/AI-ML%20%2B%20LLM-purple)
![Status](https://img.shields.io/badge/status-active-success)

# Nexus - AI Resume Analyzer & Interview Platform

> An AI-powered platform that analyzes resumes, detects skill gaps, recommends jobs, and generates personalized interview strategies using ML + LLMs.

---

## Live Demo

🔗 https://resume-analysis-gray-five.vercel.app

---

## Features

### AI Resume Analysis

* NLP-based resume parsing
* Skill extraction & matching
* Resume-to-job compatibility score
* Missing skills detection

### Job Recommendations

* Fetches top matching jobs based on resume
* Direct redirection to job application pages

### AI Interview Preparation (LLM Powered)

* Technical questions generation
* Behavioral questions generation
* Personalized interview roadmap

### Authentication System

* Email OTP verification
* Secure JWT-based authentication
* Forgot password functionality

### Smart Dashboard

* Resume history tracking
* Performance analytics
* Skill improvement insights

### Profile System

* Bio, skills, and career goals
* Social links (LeetCode, GitHub, etc.)
* Custom skill addition

### Community Chat

* Real-time chat (Socket.io)
* Reactions, replies, media sharing
* Toxicity detection (ML model)

### API Key System

* Bring your own Groq API key
* Unlock advanced AI features

---

## 🏗️ Architecture Diagram

```mermaid
graph TD

%% ================= FRONTEND =================
subgraph FRONTEND ["Frontend Layer - React"]
A1[Landing Page]
A2[Authentication Pages]
A3[Dashboard UI]
A4[Profile Management]
A5[Resume Upload UI]
A6[Community Chat UI]
A7[Settings - API Key]
A8[State Management]
A9[Routing]
A10[Socket Client]
end

%% ================= BACKEND =================
subgraph BACKEND ["Backend Layer - Node Express"]
B1[Express Server]
B2[REST API Controllers]
B3[Auth Service]
B4[JWT Middleware]
B5[Resume Service]
B6[Analysis Service]
B7[Job Recommendation Service]
B8[User Profile Service]
B9[Community Chat Service]
B10[Notification Service]
end

%% ================= DATABASE =================
subgraph DATABASE ["Database Layer - MongoDB"]
C1[(MongoDB)]
C2[Users Collection]
C3[Resumes Collection]
C4[Analysis Results]
C5[Jobs Collection]
C6[Chat Messages]
C7[Profile Data]
end

%% ================= ML SERVICE =================
subgraph ML ["ML NLP Service - Python"]
D1[FastAPI Server]
D2[Resume Parser]
D3[Skill Extractor]
D4[Matching Model]
D5[Scoring Engine]
end

%% ================= LLM =================
subgraph LLM ["LLM Layer - Groq"]
E1[Technical Questions]
E2[Behavioral Questions]
E3[Interview Roadmap]
end

%% ================= EXTERNAL =================
subgraph EXTERNAL ["External Services"]
F1[Job APIs]
F2[Email OTP Service]
F3[Cloud Storage]
end

%% ================= FLOW =================

A1 --> A2
A2 --> B1
A5 --> B5
A6 --> B9
A10 --> B9
A7 --> B8

B1 --> B2
B2 --> B3
B3 --> B4

B3 --> F2
B3 --> C2

B5 --> C3
B5 --> D1

D1 --> D2
D2 --> D3
D3 --> D4
D4 --> D5

D5 --> B6
B6 --> C4

B6 --> B7
B7 --> F1
B7 --> C5

B6 --> E1
B6 --> E2
B6 --> E3

B8 --> C2
B8 --> C7
B6 --> C4

B9 --> C6
B9 --> A6

B5 --> F3

%% USER FLOW
U1[User] --> A1
U1 --> A5
U1 --> A3
U1 --> A4
U1 --> A6
U1 --> A7

A3 --> B6
A3 --> B7

E1 --> A3
E2 --> A3
E3 --> A3
```

---

## Workflow

1. User registers and verifies email via OTP
2. Uploads resume + optional job description
3. ML model analyzes resume:

   * Skill match %
   * Missing skills
   * Career suggestions
4. System fetches job recommendations
5. Optional: Add Groq API key
6. LLM generates:

   * Technical questions
   * Behavioral questions
   * Interview roadmap
7. User tracks progress via dashboard

---

## 📸 Screenshots

### 🔐 Authentication

<p align="center">
  <img src="https://github.com/user-attachments/assets/21da6b2c-d727-47ea-9248-a3fbaab4481c" width="800"/>
</p>

---

### 🏠 Landing Page (Mobile View)

<p align="center">
  <img src="https://github.com/user-attachments/assets/af8b8675-d740-4f1b-a899-dea87d49d6fa" width="22%"/>
  <img src="https://github.com/user-attachments/assets/518a6800-9dcc-47a6-9209-037ee7b2b4af" width="22%"/>
  <img src="https://github.com/user-attachments/assets/93444d8e-259f-42c2-bfab-ba5142fbd797" width="22%"/>
  <img src="https://github.com/user-attachments/assets/414e2a21-5e06-47ee-a541-d0a9ba22717c" width="22%"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/da7a272b-74c3-4844-b186-bcf0eab6ef4d" width="22%"/>
  <img src="https://github.com/user-attachments/assets/46c5191f-9299-437f-af2b-6887960f28a0" width="22%"/>
  <img src="https://github.com/user-attachments/assets/70da5389-1c84-4a7c-bdd8-09bc2b3fa253" width="22%"/>
  <img src="https://github.com/user-attachments/assets/ac77e150-82c0-4ac3-a9a2-c30ff70133fe" width="22%"/>
</p>

---

### 📊 Dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/364baf5e-b8aa-4389-a102-b225f63bbba5" width="100%"/>
</p>

---

### 💳 My Plan

<p align="center">
  <img src="https://github.com/user-attachments/assets/daca7ee9-cfc4-481a-a1ff-2ada630c0151" width="100%"/>
</p>

---

### 📄 Resume Analysis Result

<p align="center">
  <img src="https://github.com/user-attachments/assets/c70c44cd-ca94-4dd5-ae1c-f70db2eab412" width="48%"/>
  <img src="https://github.com/user-attachments/assets/025af4f7-e847-4f05-b4f6-ae4c5f349cc9" width="48%"/>
</p>

#### 📱 Mobile View

<p align="center">
  <img src="https://github.com/user-attachments/assets/147de796-1f87-4f3d-8764-903af40b0aaf" width="30%"/>
  <img src="https://github.com/user-attachments/assets/3e173492-cc60-4566-84cc-8bcce18138c4" width="30%"/>
  <img src="https://github.com/user-attachments/assets/5c5c0fe0-fe0c-471d-b68e-c5cba5f4bfa6" width="30%"/>
</p>

---

### 👤 Profile Section

<p align="center">
  <img src="https://github.com/user-attachments/assets/ad63dc80-e370-4f0b-bfc5-5c8967c33fbd" width="100%"/>
</p>

---

### 💬 Community Chat

<p align="center">
  <img src="https://github.com/user-attachments/assets/ffbf0349-044b-4c3e-af2d-4c6ccf31e1e2" width="100%"/>
</p>

---

### ⚙️ Settings (API Key)

<p align="center">
  <img src="https://github.com/user-attachments/assets/ce0988b7-fdca-4299-ae18-b201997f14ba" width="100%"/>
</p>

---

### 🛠️ Admin Dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/2bd619c0-aede-4c46-ba7e-1ae47bb8aaf6" width="60%"/>
</p>

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS / SCSS
* Context API / Redux
* Socket.io Client

### Backend

* Node.js
* Express.js
* JWT Authentication
* REST APIs

### Database

* MongoDB

### AI / ML

* Python (FastAPI)
* NLP (Resume parsing & scoring)
* Custom ML Models

### LLM Integration

* Groq API

### External Services

* Email OTP Service
* Job Scraping APIs
* Cloud Storage

---

## API Endpoints

### Authentication

| Method | Endpoint                  | Description                            |
| ------ | ------------------------- | -------------------------------------- |
| POST   | /api/auth/register        | Register a new user                    |
| POST   | /api/auth/login           | Authenticate user and return token     |
| POST   | /api/auth/logout          | Logout user                            |
| GET    | /api/auth/get-me          | Get current authenticated user details |
| POST   | /api/auth/forgot-password | Send OTP to user's email               |
| POST   | /api/auth/verify-otp      | Verify OTP for password reset          |
| POST   | /api/auth/reset-password  | Reset user password                    |

---

### Resume & Analysis

| Method | Endpoint                   | Description                                                                            |
| ------ | -------------------------- | -------------------------------------------------------------------------------------- |
| POST   | /api/resume/analyze-resume | Analyze resume using NLP model and return match score, missing skills, and suggestions |

---

### Interview (AI + LLM)

| Method | Endpoint                                     | Description                                      |
| ------ | -------------------------------------------- | ------------------------------------------------ |
| POST   | /api/interview                               | Generate interview report from resume (ML + LLM) |
| GET    | /api/interview                               | Get all interview reports for user               |
| GET    | /api/interview/report/:interviewId           | Get specific interview report                    |
| POST   | /api/interview/resume/pdf/:interviewReportId | Generate downloadable resume PDF                 |

---

### Plans / Roadmap

| Method | Endpoint                                         | Description                          |
| ------ | ------------------------------------------------ | ------------------------------------ |
| POST   | /api/plans                                       | Create a new learning/interview plan |
| GET    | /api/plans                                       | Get all user plans                   |
| GET    | /api/plans/:planId                               | Get plan by ID                       |
| PATCH  | /api/plans/:planId/day/:dayIndex/task/:taskIndex | Toggle task completion               |
| POST   | /api/plans/:planId/day/:dayIndex                 | Add new task                         |
| DELETE | /api/plans/:planId/day/:dayIndex/task/:taskIndex | Delete task                          |

---

### Profile

| Method | Endpoint                  | Description              |
| ------ | ------------------------- | ------------------------ |
| POST   | /api/profile/create       | Create user profile      |
| GET    | /api/profile/me           | Get current user profile |
| PUT    | /api/profile/update       | Update profile details   |
| POST   | /api/profile/upload-image | Upload profile image     |

---

### Settings

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| POST   | /api/settings/save-grok-key | Save user's Groq API key |

---

### File Upload

| Method | Endpoint    | Description                        |
| ------ | ----------- | ---------------------------------- |
| POST   | /api/upload | Upload files (resume, media, etc.) |

---

### Admin

| Method | Endpoint             | Description                          |
| ------ | -------------------- | ------------------------------------ |
| GET    | /api/admin/stats     | Get platform statistics (admin only) |
| GET    | /api/admin/users     | Get all users (admin only)           |
| DELETE | /api/admin/users/:id | Delete a user (admin only)           |

---


---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/repo-name.git
cd repo-name
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root of your backend:

### Backend (.env)

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
ENCRYPTION_KEY=your_32_char_encryption_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ML_SERVICE_URL=your_ml_service_url
GOOGLE_GENAI_API_KEY=your_google_api_key
BREVO_API_KEY=your_brevo_api_key
```

### Frontend (.env)

```
VITE_BACKEND_URL=your_backend_url
```

### 4. Run the app

```bash
npm run dev
```

---

## Contribution Guide

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Make changes
4. Commit

```bash
git commit -m "Added new feature"
```

5. Push

```bash
git push origin feature-name
```

6. Open Pull Request

---

## Roadmap

* [ ] LeetCode-style skill grading system
* [ ] AI mock interviews (voice-based)
* [ ] Resume auto-enhancement
* [ ] Recruiter dashboard
* [ ] Analytics improvements

---

## ⭐ Support

If you like this project, please ⭐ the repo!

---

## Author

**Akash Santra**

---
