
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import CodeMirror from "@uiw/react-codemirror";

import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";

import {
  Code2,
  Play,
  Send,
  RefreshCw,
  Server,
  FileCode2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const languages = {
  c: {
    label: "C",
    filename: "main.c",
    extension: cpp(),
  },
  cpp: {
    label: "C++",
    filename: "main.cpp",
    extension: cpp(),
  },
  python: {
    label: "Python",
    filename: "main.py",
    extension: python(),
  },
  java: {
    label: "Java",
    filename: "Main.java",
    extension: java(),
  },
};

function Workspace() {
  const location = useLocation();

  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [language, setLanguage] = useState("cpp");

  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState(
    location.state?.problemId || 1
  );

  const [username, setUsername] = useState("");

  const [codes, setCodes] = useState({
    c: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}`,
    python: `print("Hello, World!")`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  });

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchSubmissionHistory = async () => {
    setHistoryLoading(true);

    try {
      const response = await API.get("/api/submit/history");
      setSubmissionHistory(response.data);
    } catch (error) {
      console.error("Could not load submission history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    API.get("/")
      .then(() => setBackendStatus("Connected"))
      .catch(() => setBackendStatus("Disconnected"));

    API.get("/api/submit/problems")
      .then((response) => {
        setProblems(response.data);
      })
      .catch((error) => {
        console.error("Could not load problems:", error);
      });

    fetchSubmissionHistory();
  }, []);

  useEffect(() => {
    if (location.state?.problemId) {
      setSelectedProblemId(Number(location.state.problemId));
    }
  }, [location.state]);

  const selectedProblem = problems.find(
    (problem) => problem.id === Number(selectedProblemId)
  );

  const handleCodeChange = (value) => {
    setCodes((previous) => ({
      ...previous,
      [language]: value,
    }));
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput("Running code...");
    setResult(null);

    try {
      const response = await API.post("/api/execute", {
        code: codes[language],
        language,
        input,
      });

      setOutput(
        response.data.output ||
          response.data.error ||
          "Program executed with no output."
      );

      setResult(response.data.status);
    } catch (error) {
      setOutput(
        error.response?.data?.message ||
          "Could not connect to the execution server."
      );
      setResult("Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!username.trim()) {
      setOutput("Please enter your username before submitting.");
      setResult("Error");
      return;
    }

    setLoading(true);
    setOutput("Checking test cases...");
    setResult(null);

    try {
      const response = await API.post("/api/submit", {
        code: codes[language],
        language,
        problemId: selectedProblemId,
        username: username.trim(),
      });

      const data = response.data;

      const details = data.results
        .map(
          (item) =>
            `Test Case ${item.testCase}: ${item.status}`
        )
        .join("\n");

      setOutput(
        `${data.status}\nPassed: ${data.passed}/${data.total}\n\n${details}`
      );

      setResult(data.status);

      await fetchSubmissionHistory();
    } catch (error) {
      setOutput(
        error.response?.data?.message ||
          "Could not submit the code."
      );
      setResult("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workspace-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">CODING WORKSPACE</p>
          <h1>Code Editor</h1>
          <p className="subtitle">
            Write, execute and submit your programming solutions.
          </p>
        </div>

        <div className="editor-status">
          <span
            className={`status-dot ${
              backendStatus === "Connected" ? "online" : "offline"
            }`}
          />
          <Server size={16} />
          Backend: {backendStatus}
        </div>
      </section>

      <section className="problem-card">
        <div className="workspace-section-heading">
          <div>
            <p className="eyebrow">CODING PROBLEM</p>
            <h2>Select a Problem</h2>
          </div>

          <FileCode2 size={25} />
        </div>

        <select
          value={selectedProblemId}
          onChange={(event) => {
            setSelectedProblemId(Number(event.target.value));
            setOutput("");
            setResult(null);
          }}
          className="language-select"
          disabled={problems.length === 0}
          aria-label="Select coding problem"
        >
          {problems.length === 0 ? (
            <option value={1}>Loading problems...</option>
          ) : (
            problems.map((problem) => (
              <option key={problem.id} value={problem.id}>
                {problem.id}. {problem.title}
              </option>
            ))
          )}
        </select>

        {selectedProblem && (
          <div className="problem-description">
            <h3>{selectedProblem.title}</h3>
            <p>{selectedProblem.description}</p>

            <div className="problem-format-grid">
              <div>
                <strong>Input Format</strong>
                <p>{selectedProblem.inputFormat}</p>
              </div>

              <div>
                <strong>Output Format</strong>
                <p>{selectedProblem.outputFormat}</p>
              </div>

              <div>
                <strong>Constraints</strong>
                <p>{selectedProblem.constraints}</p>
              </div>
            </div>

            <span className="testcase-count">
              {selectedProblem.testCaseCount} test cases
            </span>
          </div>
        )}
      </section>

      <section className="problem-card participant-card">
        <div>
          <p className="eyebrow">PARTICIPANT DETAILS</p>
          <h2>Your Username</h2>
          <p>Use this name to appear on the leaderboard.</p>
        </div>

        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter your display name"
          maxLength={20}
          aria-label="Your username"
        />
      </section>

      <section className="editor-card">
        <div className="editor-toolbar">
          <div className="file-info">
            <Code2 size={17} />
            <span>{languages[language].filename}</span>
          </div>

          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            aria-label="Select programming language"
            className="language-select"
          >
            {Object.entries(languages).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="code-area">
          <CodeMirror
            value={codes[language]}
            height="480px"
            theme={oneDark}
            extensions={[languages[language].extension]}
            onChange={handleCodeChange}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
            }}
          />
        </div>

        <div className="editor-footer">
          <span className="footer-info">
            {languages[language].label} · Ready to code
          </span>

          <div className="editor-actions">
            <button
              className="run-button"
              onClick={handleRun}
              disabled={loading || backendStatus !== "Connected"}
            >
              <Play size={16} />
              {loading ? "Running..." : "Run Code"}
            </button>

            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={
                loading ||
                backendStatus !== "Connected" ||
                !selectedProblem
              }
            >
              <Send size={16} />
              {loading ? "Checking..." : "Submit"}
            </button>
          </div>
        </div>
      </section>

      <section className="workspace-output-grid">
        <article className="output-card">
          <div className="output-heading">
            <div>
              <p className="eyebrow">CUSTOM INPUT</p>
              <h2>Program Input</h2>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Enter input for your program..."
            rows={8}
          />

          <p className="output-hint">
            Provide custom input to test your program.
          </p>
        </article>

        <article className="output-card">
          <div className="output-heading">
            <div>
              <p className="eyebrow">PROGRAM RESPONSE</p>
              <h2>Execution Result</h2>
            </div>

            {result && (
              <span
                className={`result-status ${
                  result === "Accepted" || result === "Success"
                    ? "success"
                    : "failure"
                }`}
              >
                {result === "Accepted" || result === "Success" ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <AlertCircle size={15} />
                )}
                {result}
              </span>
            )}
          </div>

          <pre className="output-content">
            {output || "Your program output will appear here."}
          </pre>
        </article>
      </section>

      <section className="history-card">
        <div className="history-heading">
          <div>
            <p className="eyebrow">YOUR ACTIVITY</p>
            <h2>Recent Submissions</h2>
          </div>

          <button
            className="history-refresh"
            onClick={fetchSubmissionHistory}
            disabled={historyLoading}
          >
            <RefreshCw size={15} />
            {historyLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {historyLoading ? (
          <p>Loading submission history...</p>
        ) : submissionHistory.length === 0 ? (
          <p>
            No submissions yet. Submit your first solution to see it here.
          </p>
        ) : (
          <div className="history-list">
            {submissionHistory.map((submission) => (
              <div className="history-item" key={submission._id}>
                <div>
                  <h3>{submission.problemTitle}</h3>
                  <p>
                    {submission.username || "Unknown"} ·{" "}
                    {submission.language.toUpperCase()} ·{" "}
                    {new Date(submission.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <span>{submission.status}</span>
                  <p>
                    {submission.passed}/{submission.total} test cases
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="bottom-note">
        Select a problem and language to start writing your solution.
      </p>
    </div>
  );
}

export default Workspace;
