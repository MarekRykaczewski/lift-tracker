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
      className="px-4 py-2 w-full text-left hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white font-semibold"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

export default LogoutButton;
