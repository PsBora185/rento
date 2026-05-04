import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar at top - Fixed, stays on top */}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Container for Sidebar + Main content */}
      <div className="flex flex-1">
        {/* Sidebar - Fixed, below navbar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main content area - only this scrolls; shift with sidebar width */}
        <main
          className={`flex-1 pt-16 overflow-y-auto h-[calc(100vh-4rem)] transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'
          }`}
        >
          <div className="px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
