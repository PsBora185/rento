import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const DashboardLayout = ({ children }) => {
  // Initialize sidebarOpen based on viewport: expanded on desktop, closed on mobile
  const initialOpen = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const [sidebarOpen, setSidebarOpen] = useState(initialOpen);
  const location = useLocation();
  
  // Check if current route is a chat page
  const isChatPage = location.pathname.startsWith('/chat/');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main
          className={`flex-1 transition-all duration-300 ${
            isChatPage 
              ? 'overflow-hidden h-[calc(100vh-4rem)]' 
              : 'pt-16 overflow-y-auto h-[calc(100vh-4rem)]'
          } ${
            sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'
          }`}
        >
          {isChatPage ? (
            children ? children : <Outlet />
          ) : (
            <div className="px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl w-full mx-auto">
              {children ? children : <Outlet />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
