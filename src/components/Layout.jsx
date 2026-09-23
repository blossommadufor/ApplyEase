import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export default function Layout({ isLoggedIn, setIsLoggedIn }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
