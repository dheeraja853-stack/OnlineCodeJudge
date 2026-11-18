
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import {
  Search,
  Code2,
  ArrowUpRight,
  Terminal,
  FileCode2,
  LoaderCircle,
} from "lucide-react";

function Problems() {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await API.get("/api/submit/problems");
        setProblems(response.data);
      } catch (err) {
        console.error("Could not load problems:", err);
        setError("Unable to load problems. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const filteredProblems = problems.filter((problem) =>
    `${problem.title} ${problem.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openWorkspace = (problemId) => {
    navigate("/workspace", {
      state: { problemId },
    });
  };

  return (
    <div className="problems-page">
      <section className="problems-hero">
        <div>
          <span className="page-eyebrow">PRACTICE AND IMPROVE</span>
          <h1>Explore Problems</h1>
          <p>
            Find a challenge, write your solution and test your programming
            skills.
          </p>
        </div>

        <div className="problems-hero-icon">
          <FileCode2 size={46} />
        </div>
      </section>

      <section className="problems-overview">
        <div className="problems-count-card">
          <div className="overview-icon">
            <Code2 size={22} />
          </div>
          <div>
            <span>Available Problems</span>
            <h2>{loading ? "—" : problems.length}</h2>
          </div>
        </div>

        <div className="problems-count-card">
          <div className="overview-icon">
            <Terminal size={22} />
          </div>
          <div>
            <span>Supported Languages</span>
            <h2>4</h2>
          </div>
        </div>
      </section>

      <section className="problems-library">
        <div className="problems-library-heading">
          <div>
            <span className="page-eyebrow">CODING LIBRARY</span>
            <h2>All Problems</h2>
            <p>Choose any problem to start coding.</p>
          </div>

          <div className="problem-search">
            <Search size={18} />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search problems..."
              aria-label="Search coding problems"
            />
          </div>
        </div>

        {loading ? (
          <div className="problems-message">
            <LoaderCircle size={22} />
            <p>Loading coding problems...</p>
          </div>
        ) : error ? (
          <div className="problems-message error-message">
            <p>{error}</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="problems-message">
            <Search size={25} />
            <p>No matching problems found.</p>
          </div>
        ) : (
          <div className="problems-grid">
            {filteredProblems.map((problem) => (
              <article className="problem-item-card" key={problem.id}>
                <div className="problem-card-top">
                  <div className="problem-number">
                    PROBLEM {String(problem.id).padStart(2, "0")}
                  </div>

                  <span className="problem-card-icon">
                    <Code2 size={20} />
                  </span>
                </div>

                <h3>{problem.title}</h3>

                <p className="problem-card-description">
                  {problem.description}
                </p>

                <div className="problem-card-meta">
                  <span>
                    <FileCode2 size={15} />
                    {problem.testCaseCount} test cases
                  </span>
                  <span>Beginner</span>
                </div>

                <button
                  className="problem-open-button"
                  onClick={() => openWorkspace(problem.id)}
                >
                  Solve Problem
                  <ArrowUpRight size={17} />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Problems;
