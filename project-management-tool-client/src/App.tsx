import { useState, useEffect } from "react";
import "./App.css";
import Board from "./components/Board";
import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`h-screen overflow-hidden transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <SignedIn>
        <Board isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      </SignedIn>

      <SignedOut>
        <div className="flex flex-col items-center justify-center h-screen space-y-6">
          <h2 className="text-2xl font-semibold">
            Welcome to Project Management App
          </h2>
          <p className="text-sm text-gray-500">
            {showSignUp
              ? "Create a new account to get started"
              : "Sign in to access your projects"}
          </p>

          <div className="flex flex-col items-center gap-4 w-[340px]">
            {showSignUp ? (
              <>
                <SignUp
                  routing="hash"
                  appearance={{
                    elements: {
                      footerAction: { display: "none" }, // hides “Don’t have an account?”
                    },
                  }}
                />
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <button
                    onClick={() => setShowSignUp(false)}
                    className="text-blue-500 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </>
            ) : (
              <>
                <SignIn
                  routing="hash"
                  appearance={{
                    elements: {
                      footerAction: { display: "none" }, // hides “Don’t have an account?”
                    },
                  }}
                />
                <p className="text-sm text-gray-500">
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="text-blue-500 hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </SignedOut>
    </div>
  );
}

export default App;
