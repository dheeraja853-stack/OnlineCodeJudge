
import { useEffect, useState } from "react";
import API from "../services/api";

import {
  Trophy,
  Medal,
  Crown,
  Users,
  Target,
  CheckCircle2,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  UsersRound,
  Sparkles,
} from "lucide-react";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/api/submit/leaderboard");
      setLeaderboard(response.data);
    } catch (err) {
      console.error("Could not load leaderboard:", err);
      setError("Unable to load leaderboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const topThree = leaderboard.slice(0, 3);
  const totalDevelopers = leaderboard.length;

  const totalSolved = leaderboard.reduce(
    (total, person) => total + person.solvedProblems,
    0
  );

  const getInitial = (username) =>
    username?.charAt(0).toUpperCase() || "?";

  const podiumOrder = [
    topThree[1],
    topThree[0],
    topThree[2],
  ].filter(Boolean);

  return (
    <div className="leaderboard-page">
      <section className="leaderboard-hero">
        <div>
          <span className="page-eyebrow">COMPETE AND ACHIEVE</span>
          <h1>Leaderboard</h1>
          <p>
            Discover top developers and track their coding achievements.
          </p>
        </div>

        <div className="leaderboard-hero-icon">
          <Trophy size={46} />
        </div>
      </section>

      <section className="leaderboard-stats">
        <article className="leaderboard-stat-card">
          <div className="leaderboard-stat-icon purple">
            <Users size={21} />
          </div>
          <div>
            <span>Developers Ranked</span>
            <h2>{loading ? "—" : totalDevelopers}</h2>
          </div>
        </article>

        <article className="leaderboard-stat-card">
          <div className="leaderboard-stat-icon green">
            <Target size={21} />
          </div>
          <div>
            <span>Problems Solved</span>
            <h2>{loading ? "—" : totalSolved}</h2>
          </div>
        </article>

        <article className="leaderboard-stat-card">
          <div className="leaderboard-stat-icon orange">
            <Trophy size={21} />
          </div>
          <div>
            <span>Top Position</span>
            <h2>
              {loading
                ? "—"
                : leaderboard.length > 0
                  ? leaderboard[0].username
                  : "—"}
            </h2>
          </div>
        </article>
      </section>

      {loading ? (
        <div className="leaderboard-message">
          <LoaderCircle size={25} />
          <p>Loading leaderboard...</p>
        </div>
      ) : error ? (
        <div className="leaderboard-message error-message">
          <AlertCircle size={22} />
          <p>{error}</p>
          <button onClick={fetchLeaderboard}>Try Again</button>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="leaderboard-message">
          <Trophy size={30} />
          <h2>No rankings yet</h2>
          <p>
            Submit an accepted solution to become the first developer
            on the leaderboard.
          </p>
        </div>
      ) : (
        <>
          {totalDevelopers === 1 && (
            <section className="leaderboard-community-notice">
              <div className="community-notice-icon">
                <UsersRound size={24} />
              </div>

              <div className="community-notice-content">
                <h3>You're leading the leaderboard!</h3>
                <p>
                  You're currently the only ranked developer on this
                  platform. Your ranking is based on your actual accepted
                  submissions. As more developers join and submit solutions,
                  their rankings will appear here automatically.
                </p>
              </div>

              <Sparkles
                className="community-notice-sparkle"
                size={22}
              />
            </section>
          )}

          {topThree.length > 0 && (
            <section className="podium-section">
              <div className="section-heading">
                <div>
                  <span className="page-eyebrow">TOP PERFORMERS</span>
                  <h2>Hall of Fame</h2>
                </div>
              </div>

              <div className="podium-grid">
                {podiumOrder.map((person) => (
                  <article
                    className={`podium-card podium-rank-${person.rank}`}
                    key={person.username}
                  >
                    <div className="podium-medal">
                      {person.rank === 1 ? (
                        <Crown size={27} />
                      ) : person.rank === 2 ? (
                        <Medal size={25} />
                      ) : (
                        <Trophy size={25} />
                      )}
                    </div>

                    <div className="podium-avatar">
                      {getInitial(person.username)}
                    </div>

                    <h3>{person.username}</h3>

                    <span className="podium-rank-label">
                      {person.rank === 1
                        ? "1st Place"
                        : person.rank === 2
                          ? "2nd Place"
                          : "3rd Place"}
                    </span>

                    <div className="podium-score">
                      <strong>{person.solvedProblems}</strong>
                      <span>Problems Solved</span>
                    </div>

                    <div className="podium-base">
                      #{person.rank}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="rankings-section">
            <div className="rankings-heading">
              <div>
                <span className="page-eyebrow">GLOBAL RANKINGS</span>
                <h2>All Developers</h2>
                <p>Rankings based on unique accepted problems.</p>
              </div>

              <button
                className="history-refresh"
                onClick={fetchLeaderboard}
                disabled={loading}
              >
                <RefreshCw size={15} />
                Refresh
              </button>
            </div>

            <div className="rankings-table-wrapper">
              <table className="rankings-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Developer</th>
                    <th>Problems Solved</th>
                    <th>Accepted</th>
                    <th>Total Submissions</th>
                  </tr>
                </thead>

                <tbody>
                  {leaderboard.map((person) => (
                    <tr key={person.username}>
                      <td>
                        <span className="rank-number">
                          #{person.rank}
                        </span>
                      </td>

                      <td>
                        <div className="rank-developer">
                          <div className="rank-avatar">
                            {getInitial(person.username)}
                          </div>
                          <strong>{person.username}</strong>
                        </div>
                      </td>

                      <td>
                        <span className="rank-solved">
                          <CheckCircle2 size={15} />
                          {person.solvedProblems}
                        </span>
                      </td>

                      <td>{person.acceptedSubmissions}</td>
                      <td>{person.totalSubmissions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <p className="bottom-note">
        Rankings are updated using recorded coding submissions.
      </p>
    </div>
  );
}

export default Leaderboard;
