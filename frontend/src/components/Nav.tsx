import { NavLink } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import LogoutButton from "./LogoutButton";

const Nav = () => {
  return (
    <div className="flex flex-col items-start p-5 bg-gray-100 dark:bg-gray-900 h-screen w-52">
      <h1 className="mb-5 w-full text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
        LiftTrackers
      </h1>
      <nav className="w-full">
        <div className="flex w-full flex-col gap-2 border-gray-300 dark:border-gray-700">
          <div className="flex items-center justify-center">
            <DarkModeToggle />
          </div>

          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 font-semibold py-2 text-left w-full ${
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
        {
          <div className="ml-auto mr-auto">
            <LogoutButton />
          </div>
        }
      </nav>
    </div>
  );
};

export default Nav;
