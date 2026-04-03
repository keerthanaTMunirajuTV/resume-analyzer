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

## ⚠️ API Limitations
* Some Gemini models were not accessible or supported with the current API key, leading to 404 errors during integration.
* Free-tier usage has limited access to certain advanced models and features.
* API rate limits and response delays affected continuous testing.
* Occasional instability in responses, especially with large resume inputs.
* AI does not always return strictly formatted JSON, requiring additional handling in backend.
* Output may vary slightly for the same input due to probabilistic nature of AI.

## 🧠 Prompts Used

During development, different prompts were used and refined to improve output quality.

* Initial Prompt
    -Simple instruction to analyze resume
    Result: AI gave long, unstructured responses
* Improved Prompt
    Added strict JSON format
    Limited number of points
    Enforced score range (0–100)
* Final Prompt Strategy
    Provided clear rules:
    Return ONLY JSON
    Keep output short and precise
    Limit points (3–5 per section)
    Include current date to avoid future date issues
    This helped generate consistent and structured output
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

## ⚠️ Challenges Faced While Using AI

* Faced major difficulty with selecting the correct Gemini model, as several models (e.g., gemini-1.5-flash, gemini-1.0-pro) returned 404 errors or were not supported.
* API key issues such as expired or invalid keys caused repeated failures during integration.
* AI responses were sometimes unstructured or included extra text, making JSON parsing difficult.
* Inconsistent outputs for the same resume required multiple prompt adjustments.

## 🛠️ How These Issues Were Resolved

* Used the List Models API to identify available and supported models, and switched to a working model (gemini-2.5-flash).
* Regenerated and correctly configured the API key in the environment variables.
* Updated backend to use the official SDK instead of raw REST calls for better reliability.
* Refined prompts to enforce strict JSON output and limited response size.
* Implemented safe JSON extraction and fallback handling in backend to avoid crashes.

---

## 🚀 Future Enhancements

* AI sometimes returned extra text instead of clean JSON
* Inconsistent scores for same resume (e.g., 78 → 80)
* Incorrect interpretation of dates (e.g., treating 2025 as future)
* Parsing AI response into JSON caused errors occasionally
* Large resume text affected response consistency

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

## ✅ Conclusion

This project demonstrates the integration of AI with full-stack development to solve real-world problems like resume analysis and job matching.
