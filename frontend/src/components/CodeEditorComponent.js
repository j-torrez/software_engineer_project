import React, { useEffect, useRef, useState } from "react";
import CodeEditor, { SelectionText } from "@uiw/react-textarea-code-editor";
import "../styles/styles.css";

function CodeEditorComponent() {
  const textRef = useRef();
  const [code, setCode] = useState(`// Write your code here`);
  const [output, setOutput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [convertLoading, setConvertLoading] = useState(false);
  const [debugLoading, setDebugLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const obj = new SelectionText(textRef.current);
      console.log("obj:", obj);
    }
  }, []);

  const handleConvert = () => {
    setConvertLoading(true);
    const apiEndpoint = "http://localhost:8080/api/generate-response";
    const encodedCode = encodeURIComponent(code);

    fetch(`${apiEndpoint}?codeSnippet=${encodedCode}&language=${selectedLanguage}`)
      .then((response) => response.json())
      .then((data) => {
        setOutput(data.content);
        setConvertLoading(false);
      })
      .catch((error) => {
        console.error("Error converting code:", error);
        setOutput("Error converting code. Please check the console for details.");
        setConvertLoading(false);
      });
  };

  const handleDebug = () => {
    setDebugLoading(true);
    const apiEndpoint = "http://localhost:8080/api/debug-code";
    const encodedCode = encodeURIComponent(code);

    fetch(`${apiEndpoint}?codeSnippet=${encodedCode}`)
      .then((response) => response.json())
      .then((data) => {
        setOutput(data.content);
        setDebugLoading(false);
      })
      .catch((error) => {
        console.error("Error debugging code:", error);
        setOutput("Error debugging code. Please check the console for details.");
        setDebugLoading(false);
      });
  };

  const handleReview = () => {
    setReviewLoading(true);
    const apiEndpoint = "http://localhost:8080/api/code-quality-check";
    const encodedCode = encodeURIComponent(code);

    fetch(`${apiEndpoint}?codeSnippet=${encodedCode}`)
      .then((response) => response.json())
      .then((data) => {
        setOutput(data.content);
        setReviewLoading(false);
      })
      .catch((error) => {
        console.error("Error reviewing code:", error);
        setOutput("Error reviewing code. Please check the console for details.");
        setReviewLoading(false);
      });
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className={`container ${isDarkTheme ? "dark-theme" : ""}`}>
      <header>
        <h1>Code Converter</h1>
        <div className="buttons-container">
          <button onClick={toggleTheme}>
            {isDarkTheme ? "Light Theme" : "Dark Theme"}
          </button>
          <div className="buttons">
            <button onClick={handleConvert} disabled={convertLoading}>
              {convertLoading ? (
                <span style={{ color: "white" }}>Converting...</span>
              ) : (
                "Convert"
              )}
            </button>
            <button onClick={handleDebug} disabled={debugLoading}>
              {debugLoading ? (
                <span style={{ color: "white" }}>Debugging...</span>
              ) : (
                "Debug"
              )}
            </button>
            <button onClick={handleReview} disabled={reviewLoading}>
              {reviewLoading ? (
                <span style={{ color: "white" }}>Reviewing...</span>
              ) : (
                "Review"
              )}
            </button>
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </header>
      <div className="content">
        <div className={`code-editor-container ${isDarkTheme ? "dark-theme" : ""}`}>
          <h3>Editor</h3>
          <CodeEditor
            value={code}
            ref={textRef}
            language="javascript"
            placeholder="Please enter code."
            onChange={(evn) => setCode(evn.target.value)}
            padding={15}
            style={{
              fontFamily:
                "ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace",
              fontSize: 12,
              height: "500px",
            }}
            className={isDarkTheme ? "dark-theme" : ""}
          />
        </div>

        <div className={`display-container ${isDarkTheme ? "dark-theme" : ""}`}>
          <h3>Display</h3>
          <pre className={`display-area ${isDarkTheme ? "dark-theme" : ""}`}>{output}</pre>
        </div>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Software Engineering Project - Juan Bosco Torrez</p>
      </footer>
    </div>
  );
}

export default CodeEditorComponent;
