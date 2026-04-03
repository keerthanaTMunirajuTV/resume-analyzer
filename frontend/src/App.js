import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";


function App() {
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

    try {
      const res = await axios.post("http://localhost:5000/analyze", formData);
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Error analyzing resume");
    }
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
    <div className="container">
      <h2>AI Resume Analyzer</h2>

      <input type="file" 
  accept=".pdf,.doc,.docx,.txt"
  onChange={(e) => setFile(e.target.files[0])} 
   />
      <br /><br />
      <button onClick={handleUpload}>Analyze Resume</button>

      {result && (
  <div className="section">
    <div className="score-container">
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
  <p>Resume Score</p>
</div>

    <h4>Profile Summary</h4>
    <p className="summary">{result.profile_summary}</p>

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
)}
    </div>
  );
}

export default App;