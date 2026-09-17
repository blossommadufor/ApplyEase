import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-dark text-slate-300 border-t border-navy-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-sm">
        <p>© {new Date().getFullYear()} ApplyEase. All rights reserved.</p>
        <div className="flex items-center gap-6 mt-4 sm:mt-0">
          <a href="#terms" className="hover:text-white transition">Terms of Service</a>
          <a href="#support" className="hover:text-white transition">Contact Support</a>
          <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
          <a href="#institutional" className="hover:text-white transition">Institutional</a>
        </div>
      </div>
    </footer>
  );
};