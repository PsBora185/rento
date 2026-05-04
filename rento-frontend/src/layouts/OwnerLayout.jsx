import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { useState } from 'react';

const OwnerLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-6 lg:p-8 w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;