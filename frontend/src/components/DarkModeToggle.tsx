import { useEffect, useState } from "react";

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex items-center space-x-2 font-semibold">
      <span className="text-sm dark:text-white">
        {darkMode ? "Dark Mode" : "Light Mode"}
      </span>
      <button
        onClick={toggleDarkMode}
        className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none ${
          darkMode ? "bg-gray-600" : "bg-gray-300"
        }`}
      >
        <span className="sr-only">Toggle Dark Mode</span>
        <span
          className={`transform transition ease-in-out duration-200 inline-block w-4 h-4 rounded-full bg-white ${
            darkMode ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default DarkModeToggle;