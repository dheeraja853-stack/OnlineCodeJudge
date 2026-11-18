
import { Code2 } from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">
          <Code2 size={24} />
        </div>

        <div>
          <h1>CodeJudge</h1>
          <span>ONLINE CODING PLATFORM</span>
        </div>
      </div>

      <div className="navbar-right">
        <span className="navbar-status-dot"></span>
        <span>Online Platform</span>
      </div>
    </header>
  );
}

export default Navbar;
