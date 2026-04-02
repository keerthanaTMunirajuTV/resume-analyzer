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

    // Extract PDF text
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text || "";

    console.log("Extracted Resume Text:", resumeText.substring(0, 200));

    // ✅ IMPORTANT: correct model name for AI Studio
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
Analyze this resume and return ONLY valid JSON:

${resumeText}

Format:
{
  "score": number,
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

    res.json({
      score: parsed?.score || 0,
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