const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer();

app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    console.log("Extracted Resume Text:", resumeText.substring(0, 200));

    // Dummy AI Response
    res.json({
      score: 82,
      profile_summary: "A motivated software developer with experience in React, Node.js, and full-stack development projects.",
      strengths: [
        "Strong project experience",
        "Good technical skills in JavaScript and React",
        "Hands-on with full-stack development"
      ],
      areas_for_improvement: [
        "Lack of quantified achievements",
        "Resume summary can be improved"
      ],
      missing_skills_or_sections: [
        "Certifications section",
        "Professional experience (if fresher, mention internships clearly)"
      ],
      suggestions: [
        "Add measurable results (e.g., improved performance by 20%)",
        "Include a clear professional summary at the top",
        "Highlight key technologies used in each project"
      ]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});