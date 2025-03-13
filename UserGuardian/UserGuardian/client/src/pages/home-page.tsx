import { useState } from "react";
import Sidebar from "@/components/shared/sidebar";
import MobileNav from "@/components/shared/mobile-nav";
import TopBar from "@/components/shared/top-bar";
import ChatInterface from "@/components/chat/chat-interface";
import DashboardView from "@/components/dashboard/dashboard-view";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      <Sidebar />
      
      {/* Mobile Sidebar - overlay when open */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar}>
          <div className="w-64 h-full bg-white dark:bg-slate-800 p-4" onClick={(e) => e.stopPropagation()}>
            {/* Mobile sidebar content */}
            <div className="flex justify-end mb-4">
              <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Render same content as main Sidebar */}
            <Sidebar />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <TopBar toggleSidebar={toggleSidebar} />
        
        {/* Chat Interface */}
        <ChatInterface />
        
        {/* Mobile Navigation */}
        <MobileNav />
      </main>
    </div>
  );
}
