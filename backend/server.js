const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());

const upload = multer();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let resumeText = "";

const fileType = req.file.mimetype;

if (fileType === "application/pdf") {
  const pdfData = await pdfParse(req.file.buffer);
  resumeText = pdfData.text;
} 
else if (
  fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
) {
  const mammoth = require("mammoth");
  const result = await mammoth.extractRawText({ buffer: req.file.buffer });
  resumeText = result.value;
} 
else if (fileType === "text/plain") {
  resumeText = req.file.buffer.toString("utf-8");
} 
else {
  return res.status(400).json({ error: "Unsupported file type" });
}

console.log("Extracted Resume Text:", resumeText.substring(0, 200));

    console.log("Extracted Resume Text:", resumeText.substring(0, 200));

    // ✅ ADD CURRENT DATE HERE
    const currentDate = new Date().toISOString().split("T")[0];

    // Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
      temperature: 0.2, 
      }
    });

    //PROMPT
    
const prompt = `
Today’s date is ${currentDate}.

Keep output SHORT and precise
- Do NOT give long explanations
- Each list should contain MAX 3–5 points only
- Score must be between 0–100 (integer only)
- Avoid unnecessary text
- Follow EXACT format below
Analyze this resume and return ONLY valid JSON.
Keep response SHORT and concise.
Analyze this resume and compare with job description.
Resume:
${resumeText}

Job Description:
${req.body.jobDesc || "Not provided"}

Return ONLY valid JSON (short and concise):

{
  "score": number (0-100),
  "profile_summary": "max 2 lines",
  "strengths": ["max 3"],
  "areas_for_improvement": ["max 3"],
  "missing_skills_or_sections": ["max 3"],
  "suggestions": ["max 3"],
  "keywords": ["8-10 keywords"],

  "match_score": number (0-100),
  "matched_skills": ["max 5"],
  "missing_skills": ["max 5"],
  "section_scores": {
    "technical_skills": number,
    "projects": number,
    "experience": number,
    "education": number
  }
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("AI RAW OUTPUT:", text);

    // Extract JSON safely
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    let parsed = null;

    if (start !== -1 && end !== -1) {
      try {
        parsed = JSON.parse(text.substring(start, end + 1));
      } catch (err) {
        console.log("JSON Parse Error:", err);
      }
    }
let score = parsed?.score || 0;

// Convert if AI gives score out of 10
if (score <= 10) {
  score = score * 10;
}

// Round it
score = Math.round(score);

    res.json({
  score: score,
  profile_summary: parsed?.profile_summary || "No summary available",
  strengths: parsed?.strengths || [],
  areas_for_improvement: parsed?.areas_for_improvement || [],
  missing_skills_or_sections: parsed?.missing_skills_or_sections || [],
  suggestions: parsed?.suggestions || [],
  keywords: parsed?.keywords || [],

   match_score: parsed?.match_score || 0,
  matched_skills: parsed?.matched_skills || [],
  missing_skills: parsed?.missing_skills || [],

  section_scores: parsed?.section_scores || {
    technical_skills: 0,
    projects: 0,
    experience: 0,
    education: 0
  }
});

  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({
      score: 0,
      profile_summary: "No summary available",
      strengths: [],
      areas_for_improvement: [],
      missing_skills_or_sections: [],
      suggestions: [],
      error: "Error analyzing resume",
    });
  }
});

// Optional: model check route
app.get("/models", async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    const data = await response.json();
    console.log("AVAILABLE MODELS:", data);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.send("Error fetching models");
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});