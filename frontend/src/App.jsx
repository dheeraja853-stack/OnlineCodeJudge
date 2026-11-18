
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import Workspace from "./pages/Workspace";
import Leaderboard from "./pages/Leaderboard";
import Submissions from "./pages/Submissions";

function AppLayout() {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="app-body">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/submissions" element={<Submissions />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
