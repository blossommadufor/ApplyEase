import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ setIsAdminLoggedIn }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-slate-50 flex font-sans text-slate-800 overflow-hidden">
      {/* Left Vertical Admin Sidebar with responsive mobile drawer support */}
      <AdminSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
      />

      {/* Main Content Pane with Fixed / Sticky Admin Navbar */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          setIsAdminLoggedIn={setIsAdminLoggedIn}
        />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}