import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

const MainDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // expanded/collapsed
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Update on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar width control
  const sidebarWidth = isMobile
    ? 0
    : isSidebarOpen
    ? 224 // w-56
    : 64; // w-16

  return (
    <div className="h-screen w-full bg-[#F8FAFC] text-black flex flex-col overflow-hidden">
      {/* Navbar */}
      <header className="h-20  w-full fixed top-0 left-0 right-0  z-40  flex items-center ">
        <Navbar toggleSidebar={toggleSidebar} />
      </header>

      {/* Content */}
      <div className="flex flex-1 pt-16  h-full relative">
        {/* Sidebar */}
        <aside
          className={`z-40 transition-all  duration-300 h-[calc(100vh-64px)] ${
            isMobile
              ? `fixed top-16 left-0 w-[224px] transform ${
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : `fixed top-20 left-0`
          }`}
          style={!isMobile ? { width: `${sidebarWidth}px` } : {}}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
          />
        </aside>

        {/* Overlay */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30"
            onClick={toggleSidebar}
          />
        )}

        {/* Outlet */}
        <main
          className="flex-1 overflow-y-auto  transition-all duration-300 custom-scrollbar bg-[#FAFAFA]"
          style={{
            marginLeft: isMobile ? 0 : `${sidebarWidth}px`,
            // height: "calc(100vh - 64px)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainDashboard;
