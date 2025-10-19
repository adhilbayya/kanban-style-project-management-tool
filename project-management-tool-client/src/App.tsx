import { useState, useEffect } from "react";
import "./App.css";
import Board from "./components/Board";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

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
      <Board isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
