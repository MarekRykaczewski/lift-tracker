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
      className="border px-5 py-1 font-bold text-white bg-red-500 rounded-full"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

export default LogoutButton;
