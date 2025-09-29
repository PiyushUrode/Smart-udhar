import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar.jsx";
import Navbar from "../Components/Navbar.jsx";

const MainDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="dashboard-layout ">
      {/* Navbar */}
      <header className="dashboard-navbar">
        <Navbar toggleSidebar={toggleSidebar} />
      </header>

      {/* Body */}
      <div className="dashboard-main ">
        {/* Sidebar */}
        <aside
          className={`dashboard-sidebar z-[99999] ${
            isMobile
              ? `mobile ${isSidebarOpen ? "open" : ""}`
              : isSidebarOpen
              ? "open"
              : "collapsed"
          }`}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
          />
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainDashboard;
