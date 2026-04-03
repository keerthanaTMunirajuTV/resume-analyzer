# AI Resume Analyzer

## 📌 Overview

The AI Resume Analyzer is a web application that analyzes resumes and provides insights such as resume score, strengths, areas of improvement, keyword extraction, and job description matching. The system uses AI to evaluate resumes and generate structured feedback for users.

---

## 🚀 Project Setup

### 1. Clone Repository

```bash
git clone <https://github.com/keerthanaTMunirajuTV/resume-analyzer>
cd resume-analyzer
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```bash
GEMINI_API_KEY=AIzaSyAkI1cXP44Q_gA5kftM11ICwDQkG2dy_wc
```

Run backend:

```bash
node server.js
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🏗️ Architecture

The project follows a **client-server architecture**:

* **Frontend (React.js)**

  * Handles UI and user interactions
  * Sends resume + job description to backend
  * Displays analysis results

* **Backend (Node.js + Express)**

  * Handles file upload using Multer
  * Extracts resume text (PDF/DOCX/TXT)
  * Sends data to AI model
  * Processes and returns structured JSON

* **AI Layer (Gemini API)**

  * Analyzes resume text
  * Generates structured insights

---

## 🤖 AI Usage

AI is used for:

* Resume evaluation
* Score generation (0–100)
* Profile summary creation
* Strengths & weaknesses identification
* Keyword extraction
* Job description matching
* Suggestions for improvement

---

## 🧠 Prompts Used

Example prompt:

```text
Analyze this resume and return ONLY valid JSON.

Current Date: ${currentDate}

Resume:
${resumeText}

Job Description:
${jobDesc}

Rules:
- Score must be out of 100
- Keep answers short and precise
- Avoid unnecessary explanation

Format:
{
  "score": number,
  "profile_summary": "",
  "keywords": [],
  "match_score": number,
  "matched_skills": [],
  "missing_skills": [],
  "section_scores": {
    "technical_skills": number,
    "projects": number,
    "experience": number,
    "education": number
  },
  "strengths": [],
  "areas_for_improvement": [],
  "missing_skills_or_sections": [],
  "suggestions": []
}
```

---

## ⚠️ Limitations

* AI output is not always consistent for the same resume
* Sometimes scores vary slightly (e.g., 78 → 80)
* AI may misinterpret dates (e.g., treating 2025 as future)
* Parsing AI response into strict JSON may fail occasionally
* Limited validation for non-standard resumes

---

## 🔧 Improvements (With More Time)

* Add authentication system
* Improve prompt engineering for consistent output
* Add resume preview before analysis
* Enhance UI with animations and better UX
* Add support for more file formats
* Improve keyword highlighting in UI
* Add export options (PDF customization)
* Optimize AI response time

---

## 📊 Insights & Learnings

* AI significantly simplified resume analysis by generating structured outputs like scores, summaries, and suggestions.
* Prompt design played a critical role in improving output quality and consistency.
* Handling AI responses required careful parsing, as outputs were not always in strict JSON format.
* Testing with multiple resumes helped identify inconsistencies and improve reliability.
* Integrating AI into a full-stack application provided practical experience in real-world AI usage.

---

## 🔍 Challenges Faced

* Inconsistent AI outputs for the same input
* Occasional incorrect interpretations (e.g., date handling issues)
* Difficulty in enforcing strict JSON responses from AI
* Managing large and unstructured resume data

---

## 🚀 Future Enhancements

* Improve prompt engineering for better accuracy
* Add stronger validation for AI responses
* Enhance UI/UX for better user experience
* Implement authentication and user history tracking
* Optimize performance and response time

---

## 📌 Features

* Resume upload (PDF, DOCX, TXT)
* AI-based analysis
* Resume scoring (0–100)
* Job description matching
* Keyword extraction
* Section-wise scoring
* Download report as PDF
* Clean dashboard UI

---

## 🧑‍💻 Tech Stack

* Frontend: React.js
* Backend: Node.js, Express.js
* AI: Gemini API
* Libraries: Multer, pdf-parse, axios, html2canvas, jsPDF

---

## 📷 Screenshots

(Add your project screenshots here)

---

## ✅ Conclusion

This project demonstrates the integration of AI with full-stack development to solve real-world problems like resume analysis and job matching.
