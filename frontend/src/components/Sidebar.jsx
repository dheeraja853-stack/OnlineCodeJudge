
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  Terminal,
  Trophy,
  History,
  ChevronLeft,
} from "lucide-react";

const navigationItems = [
  {
    title: "OVERVIEW",
    items: [
      {
        name: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "CODING",
    items: [
      {
        name: "Problems",
        path: "/problems",
        icon: Code2,
      },
      {
        name: "Workspace",
        path: "/workspace",
        icon: Terminal,
      },
    ],
  },
  {
    title: "COMPETITION",
    items: [
      {
        name: "Leaderboard",
        path: "/leaderboard",
        icon: Trophy,
      },
      {
        name: "My Submissions",
        path: "/submissions",
        icon: History,
      },
    ],
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-heading">
        <span>MENU</span>
        <button className="sidebar-collapse" aria-label="Collapse sidebar">
          <ChevronLeft size={17} />
        </button>
      </div>

      <nav className="sidebar-navigation">
        {navigationItems.map((section) => (
          <div className="nav-section" key={section.title}>
            <p className="nav-section-title">{section.title}</p>

            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={19} strokeWidth={1.8} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user-icon">D</div>
        <div className="sidebar-user-info">
          <strong>CodeJudge User</strong>
          <span>Developer Account</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
