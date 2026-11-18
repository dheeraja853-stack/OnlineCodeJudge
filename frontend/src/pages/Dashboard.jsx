
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

import {
  Code2,
  Trophy,
  Target,
  Activity,
  ArrowUpRight,
  ArrowRight,
  Clock3,
  CheckCircle2,
  Terminal,
} from "lucide-react";

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [historyResponse, leaderboardResponse] =
          await Promise.all([
            API.get("/api/submit/history"),
            API.get("/api/submit/leaderboard"),
          ]);

        setHistory(historyResponse.data);
        setLeaderboard(leaderboardResponse.data);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const acceptedSubmissions = history.filter(
    (item) => item.status === "Accepted"
  );

  const solvedProblems = new Set(
    acceptedSubmissions.map((item) => item.problemId)
  ).size;

  const totalSubmissions = history.length;

  const acceptanceRate =
    totalSubmissions > 0
      ? Math.round(
          (acceptedSubmissions.length / totalSubmissions) * 100
        )
      : 0;

  const latestSubmissions = history.slice(0, 5);

  const currentUser = leaderboard.find(
    (item) => item.username === "Dheeraj"
  );

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <span className="page-eyebrow">YOUR CODING OVERVIEW</span>
          <h1>Welcome back, Dheeraj <span>👋</span></h1>
          <p>
            Keep learning, keep solving, and improve your coding skills.
          </p>
        </div>

        <Link to="/workspace" className="primary-action">
          <Terminal size={18} />
          Start Coding
          <ArrowUpRight size={17} />
        </Link>
      </section>

      <section className="dashboard-stats">
        <article className="stat-card">
          <div className="stat-icon purple">
            <Code2 size={21} />
          </div>
          <span>Problems Solved</span>
          <h2>{loading ? "—" : solvedProblems}</h2>
          <p>Unique accepted problems</p>
        </article>

        <article className="stat-card">
          <div className="stat-icon blue">
            <Activity size={21} />
          </div>
          <span>Total Submissions</span>
          <h2>{loading ? "—" : totalSubmissions}</h2>
          <p>All recorded attempts</p>
        </article>

        <article className="stat-card">
          <div className="stat-icon green">
            <Target size={21} />
          </div>
          <span>Acceptance Rate</span>
          <h2>{loading ? "—" : `${acceptanceRate}%`}</h2>
          <p>Accepted submissions</p>
        </article>

        <article className="stat-card">
          <div className="stat-icon orange">
            <Trophy size={21} />
          </div>
          <span>Leaderboard Rank</span>
          <h2>
            {loading ? "—" : currentUser ? `#${currentUser.rank}` : "—"}
          </h2>
          <p>Your current position</p>
        </article>
      </section>

      <section className="dashboard-main-grid">
        <article className="dashboard-panel activity-panel">
          <div className="panel-heading">
            <div>
              <span className="page-eyebrow">RECENT ACTIVITY</span>
              <h2>Recent Submissions</h2>
            </div>

            <Link to="/submissions" className="text-link">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <p className="empty-state">Loading submissions...</p>
          ) : latestSubmissions.length === 0 ? (
            <div className="empty-state">
              <Code2 size={28} />
              <p>No submissions yet.</p>
              <Link to="/workspace">Try your first problem</Link>
            </div>
          ) : (
            <div className="recent-submission-list">
              {latestSubmissions.map((submission) => (
                <div className="recent-submission" key={submission._id}>
                  <div className="submission-icon">
                    {submission.status === "Accepted" ? (
                      <CheckCircle2 size={19} />
                    ) : (
                      <Clock3 size={19} />
                    )}
                  </div>

                  <div className="submission-details">
                    <strong>{submission.problemTitle}</strong>
                    <span>
                      {submission.language.toUpperCase()} ·{" "}
                      {new Date(submission.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div
                    className={`submission-badge ${
                      submission.status === "Accepted"
                        ? "accepted"
                        : "rejected"
                    }`}
                  >
                    {submission.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="dashboard-panel leaderboard-preview">
          <div className="panel-heading">
            <div>
              <span className="page-eyebrow">COMPETITION</span>
              <h2>Top Developers</h2>
            </div>

            <Link to="/leaderboard" className="text-link">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <p className="empty-state">Loading leaderboard...</p>
          ) : leaderboard.length === 0 ? (
            <p className="empty-state">No leaderboard entries yet.</p>
          ) : (
            <div className="leaderboard-preview-list">
              {leaderboard.slice(0, 5).map((person) => (
                <div className="leaderboard-person" key={person.username}>
                  <span className="person-rank">
                    #{person.rank}
                  </span>

                  <div className="person-avatar">
                    {person.username.charAt(0).toUpperCase()}
                  </div>

                  <strong>{person.username}</strong>

                  <span className="person-score">
                    {person.solvedProblems} solved
                  </span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="dashboard-cta">
        <div className="cta-icon">
          <Terminal size={26} />
        </div>

        <div>
          <span className="page-eyebrow">READY FOR YOUR NEXT CHALLENGE?</span>
          <h2>Turn your ideas into working code.</h2>
          <p>Choose a problem, write your solution and test your skills.</p>
        </div>

        <Link to="/problems" className="secondary-action">
          Explore Problems <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  );
}

export default Dashboard;
