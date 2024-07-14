import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate("/login");
  };

  return (
    <button
      className="px-4 py-2 bg-red-500 text-white dark:bg-red-700 hover:bg-red-600 dark:hover:bg-red-600 rounded-md w-full dark:text-white font-semibold"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

export default LogoutButton;
