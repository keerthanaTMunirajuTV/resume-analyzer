import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

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

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>AI Resume Analyzer</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br /><br />
      <button onClick={handleUpload}>Analyze Resume</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Score: {result.score ?? "N/A"}</h3>

          <h4>Profile Summary</h4>
          <p>{result.profile_summary ?? "No summary available"}</p>

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