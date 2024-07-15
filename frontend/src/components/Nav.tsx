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
    <div className="relative">
      {/* Navigation for larger viewports */}
      <nav className="hidden h-[100vh] px-2 sm:flex sm:flex-col sm:bg-gray-100 sm:dark:bg-gray-800">
        <div className="flex flex-col py-2">
          <div className="flex items-center sm:px-0 px-2 sm:justify-center justify-between w-full">
            <h1 className="sm:text-2xl text-4xl p-2 font-bold text-gray-800 dark:text-gray-200">
              LiftTrackers
            </h1>
          </div>
        </div>

        <div className="border-b-2 my-2 border-gray-300 dark:border-gray-700" />
        <div className="flex flex-col gap-2 border-gray-300 dark:border-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 font-semibold py-2 w-full ${
                isActive
                  ? "font-bold text-blue-600"
                  : "text-gray-800 dark:text-gray-200"
              } hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/workouts"
            className={({ isActive }) =>
              `px-4 font-semibold py-2 w-full ${
                isActive
                  ? "font-bold text-blue-500"
                  : "text-gray-800 dark:text-gray-200"
              } hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md`
            }
          >
            Workouts
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `px-4 font-semibold py-2 w-full ${
                isActive
                  ? "font-bold text-blue-500"
                  : "text-gray-800 dark:text-gray-200"
              } hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md`
            }
          >
            Settings
          </NavLink>
        </div>
        <div className="mt-auto mb-2 dark:bg-gray-700 bg-gray-200 rounded-lg">
          <div className="px-4 py-2 self-end dark:text-white font-semibold">
            <div className="px-4 py-2 w-full">
              <DarkModeToggle />
            </div>

            <div className="border-b-2 my-2 border-gray-300 dark:border-gray-500" />

            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Navigation for smaller viewports */}
      <div className="flex sm:hidden bg-gray-200 dark:text-white dark:bg-gray-800 items-center sm:px-0 sm:justify-center justify-between w-full">
        <h1 className="sm:text-2xl text-4xl p-2 font-bold">LiftTracker</h1>

        <button
          className="block sm:hidden p-2 focus:outline-none"
          onClick={toggleNav}
        >
          <svg
            className="w-8 h-8"
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

      <nav
        className={`fixed top-0 right-0 h-full px-2 w-64 bg-gray-100 dark:bg-gray-800 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 sm:hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col gap-2 text-right border-gray-300 dark:border-gray-700">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 font-semibold py-2 w-full ${
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
                `px-4 font-semibold py-2 w-full ${
                  isActive
                    ? "font-bold text-blue-500"
                    : "text-gray-800 dark:text-gray-200"
                } hover:bg-gray-300 dark:hover:bg-gray-700`
              }
            >
              Workouts
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `px-4 font-semibold py-2 w-full ${
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
          <div className="px-4 py-2 self-end w-full dark:bg-gray-700 bg-gray-200 rounded-lg dark:text-white font-semibold">
            <div className="px-4 py-2 w-full">
              <DarkModeToggle />
            </div>

            <div className="border-b-2 my-2 border-gray-300 dark:border-gray-500" />

            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 sm:hidden"
          onClick={toggleNav}
        ></div>
      )}
    </div>
  );
};

export default Nav;
