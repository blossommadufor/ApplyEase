import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logoDark from "../assets/logo-dark.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const AuthPage = ({ setIsLoggedIn }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [isSignUp, setIsSignUp] = useState(mode === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsSignUp(searchParams.get("mode") === "signup");
  }, [searchParams]);

  const toggleMode = () => {
    const newMode = isSignUp ? "signin" : "signup";
    setSearchParams({ mode: newMode });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");

    if (isSignUp) {
      navigate("/select-university", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5E6D8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center mb-6">
          <img src={logoDark} alt="ApplyEase" className="w-36 h-auto object-contain" />
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-[#1F2430]">
          {isSignUp ? "Create your account" : "Sign in to your account"}
        </h2>
        <p className="mt-2 text-center text-sm text-[#8B93A1]">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="font-medium text-[#E8792E] hover:underline focus:outline-none cursor-pointer"
          >
            {isSignUp ? "Sign in" : "Get started"}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm rounded-xl border border-[#DCE1E7] sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-[#1F2430] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B93A1]">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-md text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1F2430] mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B93A1]">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-md text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2430] mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B93A1]">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-md text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-[#E8792E] hover:bg-[#C96A28] focus:outline-none transition cursor-pointer"
              >
                {isSignUp ? "Create Account" : "Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs text-[#8B93A1] hover:text-[#1F2430] transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};