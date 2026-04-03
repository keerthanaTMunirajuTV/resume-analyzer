const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
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
Analyze this resume and return ONLY valid JSON.

IMPORTANT RULES:
- Today's date is ${currentDate}
- Score MUST be between 0 to 100 (integer only)
- Keep response SHORT and CONCISE
- Use simple and clear language
- Limit each section:

  • Profile Summary → max 2 lines
  • Strengths → max 5 points
  • Areas for Improvement → max 4 points
  • Missing Skills / Sections → max 3 points
  • Suggestions → max 4 points

- Avoid long sentences
- Avoid repetition
- Focus only on important points


${resumeText}

Format:
{
  "score": number(0-100),
  "profile_summary": "",
  "strengths": [],
  "areas_for_improvement": [],
  "missing_skills_or_sections": [],
  "suggestions": []
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