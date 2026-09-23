
export const Footer = () => {
  return (
    <footer className="bg-dark text-slate-300 border-t border-navy-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm gap-4 sm:gap-0 text-center sm:text-left">
        <p>© {new Date().getFullYear()} ApplyEase. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
          <a href="#terms" className="hover:text-white transition">Terms of Service</a>
          <a href="#support" className="hover:text-white transition">Contact Support</a>
          <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
          <a href="#institutional" className="hover:text-white transition">Institutional</a>
        </div>
      </div>
    </footer>
  );
};