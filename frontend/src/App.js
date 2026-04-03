import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function App() {
  const [jobDesc, setJobDesc] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDesc", jobDesc);

    try {
      const res = await axios.post("http://localhost:5000/analyze", formData);
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Error analyzing resume");
    }
  };

const downloadPDF = async () => {
  const element = document.getElementById("report");

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("resume-analysis.pdf");
};

  useEffect(() => {
    if (result?.score) {
      let start = 0;
      const end = result.score;
      setDisplayScore(0);

      const interval = setInterval(() => {
        start += 1;
        setDisplayScore(start);
        if (start >= end) clearInterval(interval);
      }, 20);

      return () => clearInterval(interval);
    }
  }, [result]);

  return (
    <>
      {!result ? (
        // CENTER SCREEN BEFORE ANALYSIS
        <div className="center-container">
          <div className="center-box">
          <h2>AI Resume Analyzer</h2>

          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <br /><br />

          <textarea
            placeholder="Paste Job Description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />

          <br /><br />

          <button onClick={handleUpload}>Analyze your Resume</button>
        </div>
        </div>
      ) : (
        // AFTER ANALYSIS (DASHBOARD UI)
        <div id="report" className="main-layout">

          {/* LEFT PANEL */}
          <div className="left-panel">
            <div className="score-container">
              <h4>Resume Score</h4>
              <div
                className="score-circle"
                style={{
                  color:
                    displayScore < 40
                      ? "red"
                      : displayScore < 70
                      ? "orange"
                      : "green",
                }}
              >
                {displayScore}
                <span>/100</span>
              </div>
              
            </div>

            <h4>Job Match Score</h4>
            <p>{result?.match_score}%</p>

            <h4>Section Scores</h4>
            <ul>
              <li>Skills: {result?.section_scores?.technical_skills}</li>
              <li>Projects: {result?.section_scores?.projects}</li>
              <li>Experience: {result?.section_scores?.experience}</li>
              <li>Education: {result?.section_scores?.education}</li>
            </ul>

            <h4>Keywords</h4>
            <div>
              {(result?.keywords || []).map((item, i) => (
                <span key={i} className="tag">{item}</span>
              ))}
            </div>

            <br />
            <button onClick={() => setResult(null)}>Upload New Resume</button>
              
              
              <button className="download-btn" onClick={downloadPDF}>
                Download PDF
              </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">
            <h3>Profile Summary</h3>
            <p className="summary">{result.profile_summary}</p>

            <h4>Matched Skills</h4>
            <ul>
              {(result?.matched_skills || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h4>Missing Skills</h4>
            <ul>
              {(result?.missing_skills || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h4>Strengths</h4>
            <ul>
              {(result?.strengths || []).slice(0, 5).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h4>Areas for Improvement</h4>
            <ul>
              {(result?.areas_for_improvement || []).slice(0, 4).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h4>Missing Skills / Sections</h4>
            <ul>
              {(result?.missing_skills_or_sections || []).slice(0, 3).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h4>Suggestions</h4>
            <ul>
              {(result?.suggestions || []).slice(0, 4).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </>
  );
}

export default App;