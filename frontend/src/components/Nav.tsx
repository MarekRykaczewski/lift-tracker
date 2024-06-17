import { NavLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Nav = () => {
  return (
    <div className="flex flex-col items-start p-5 bg-gray-100 h-screen w-52">
      <h1 className="mb-5 text-2xl text-gray-800">LiftTrackers</h1>
      <LogoutButton />
      <nav className="flex flex-col gap-2 w-full">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-4 py-2 text-left w-full ${
              isActive ? "font-bold text-blue-600" : "text-gray-800"
            } hover:bg-gray-300`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/workouts"
          className={({ isActive }) =>
            `px-4 py-2 text-left w-full ${
              isActive ? "font-bold text-blue-600" : "text-gray-800"
            } hover:bg-gray-300`
          }
        >
          Workouts
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `px-4 py-2 text-left w-full ${
              isActive ? "font-bold text-blue-600" : "text-gray-800"
            } hover:bg-gray-300`
          }
        >
          Settings
        </NavLink>
      </nav>
    </div>
  );
};

export default Nav;
