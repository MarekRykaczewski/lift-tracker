import { useState } from "react";
import { NavLink } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import LogoutButton from "./LogoutButton";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-full flex-col sm:p-4 bg-gray-100 dark:bg-gray-900">
      <div className="flex items-center justify-center w-full">
        <h1 className="text-2xl p-2 font-bold text-gray-800 dark:text-gray-200">
          LiftTrackers
        </h1>

        <button
          className="block sm:hidden p-2 text-gray-800 dark:text-gray-200 focus:outline-none"
          onClick={toggleNav}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      <nav className={`w-full sm:mt-4 ${isOpen ? "block" : "hidden"} sm:block`}>
        <div className="px-4 py-2 w-full dark:text-white font-semibold">
          <DarkModeToggle />
        </div>
        <div className="border-b-2 my-2 border-gray-300 dark:border-gray-700" />
        <div className="flex flex-col gap-2 border-gray-300 dark:border-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 font-semibold py-2 text w-full ${
                isActive
                  ? "font-bold text-blue-600"
                  : "text-gray-800 dark:text-gray-200"
              } hover:bg-gray-300 dark:hover:bg-gray-700`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/workouts"
            className={({ isActive }) =>
              `px-4 font-semibold py-2 text-left w-full ${
                isActive
                  ? "font-bold text-blue-600"
                  : "text-gray-800 dark:text-gray-200"
              } hover:bg-gray-300 dark:hover:bg-gray-700`
            }
          >
            Workouts
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `px-4 font-semibold py-2 text-left w-full ${
                isActive
                  ? "font-bold text-blue-600"
                  : "text-gray-800 dark:text-gray-200"
              } hover:bg-gray-300 dark:hover:bg-gray-700`
            }
          >
            Settings
          </NavLink>
        </div>
        <div className="border-b-2 my-2 border-gray-300 dark:border-gray-700" />
        <LogoutButton />
      </nav>
    </div>
  );
};

export default Nav;
