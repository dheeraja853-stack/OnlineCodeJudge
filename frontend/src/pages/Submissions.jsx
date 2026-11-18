
import { useEffect, useState } from "react";
import API from "../services/api";

import {
  History,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  FileCode2,
  CalendarDays,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubmissions = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/api/submit/history");
      setSubmissions(response.data);
    } catch (err) {
      console.error("Could not load submissions:", err);
      setError("Unable to load submissions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const acceptedCount = submissions.filter(
    (item) => item.status === "Accepted"
  ).length;

  const wrongAnswerCount = submissions.filter(
    (item) => item.status !== "Accepted"
  ).length;

  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch = [
      item.problemTitle,
      item.username,
      item.language,
      item.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Accepted" && item.status === "Accepted") ||
      (statusFilter === "Wrong Answer" && item.status !== "Accepted");

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="submissions-page">
      <section className="submissions-hero">
        <div>
          <span className="page-eyebrow">YOUR CODING JOURNEY</span>
          <h1>My Submissions</h1>
          <p>
            Review your attempts, track results and monitor your progress.
          </p>
        </div>

        <div className="submissions-hero-icon">
          <History size={46} />
        </div>
      </section>

      <section className="submissions-stats">
        <article className="submission-stat-card">
          <div className="submission-stat-icon purple">
            <FileCode2 size={21} />
          </div>
          <div>
            <span>Total Submissions</span>
            <h2>{loading ? "—" : submissions.length}</h2>
          </div>
        </article>

        <article className="submission-stat-card">
          <div className="submission-stat-icon green">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <span>Accepted</span>
            <h2>{loading ? "—" : acceptedCount}</h2>
          </div>
        </article>

        <article className="submission-stat-card">
          <div className="submission-stat-icon red">
            <XCircle size={21} />
          </div>
          <div>
            <span>Other Results</span>
            <h2>{loading ? "—" : wrongAnswerCount}</h2>
          </div>
        </article>
      </section>

      <section className="submissions-library">
        <div className="submissions-heading">
          <div>
            <span className="page-eyebrow">SUBMISSION RECORDS</span>
            <h2>All Attempts</h2>
            <p>Your latest recorded submissions.</p>
          </div>

          <button
            className="history-refresh"
            onClick={fetchSubmissions}
            disabled={loading}
          >
            <RefreshCw size={15} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="submission-controls">
          <div className="submission-search">
            <Search size={18} />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search problem, language or username..."
              aria-label="Search submissions"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter submissions by status"
            className="language-select"
          >
            <option value="All">All Statuses</option>
            <option value="Accepted">Accepted</option>
            <option value="Wrong Answer">Other Results</option>
          </select>
        </div>

        {loading ? (
          <div className="submissions-message">
            <LoaderCircle size={24} />
            <p>Loading your submissions...</p>
          </div>
        ) : error ? (
          <div className="submissions-message error-message">
            <AlertCircle size={22} />
            <p>{error}</p>
            <button onClick={fetchSubmissions}>Try Again</button>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="submissions-message">
            <History size={30} />
            <h3>No submissions found</h3>
            <p>
              {submissions.length === 0
                ? "Your submissions will appear here after you submit a solution."
                : "Try changing your search or status filter."}
            </p>
          </div>
        ) : (
          <div className="submissions-table-wrapper">
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Developer</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Test Cases</th>
                  <th>Submitted At</th>
                </tr>
              </thead>

              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission._id}>
                    <td>
                      <div className="submission-problem-name">
                        <FileCode2 size={17} />
                        <strong>{submission.problemTitle}</strong>
                      </div>
                    </td>

                    <td>{submission.username || "Unknown"}</td>

                    <td>
                      <span className="language-tag">
                        {submission.language.toUpperCase()}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`submission-status ${
                          submission.status === "Accepted"
                            ? "accepted"
                            : "rejected"
                        }`}
                      >
                        {submission.status === "Accepted" ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}
                        {submission.status}
                      </span>
                    </td>

                    <td>
                      <span className="testcase-result">
                        {submission.passed}/{submission.total}
                      </span>
                    </td>

                    <td>
                      <span className="submission-date">
                        <CalendarDays size={15} />
                        {formatDate(submission.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && filteredSubmissions.length > 0 && (
          <div className="submission-results-footer">
            Showing {filteredSubmissions.length} of {submissions.length} submissions
          </div>
        )}
      </section>

      <p className="bottom-note">
        Your submission records are stored in the database.
      </p>
    </div>
  );
}

export default Submissions;
