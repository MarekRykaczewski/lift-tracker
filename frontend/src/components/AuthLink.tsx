import React from "react";
import { Link } from "react-router-dom";

interface AuthLinkProps {
  method: "login" | "register";
}

const AuthLink: React.FC<AuthLinkProps> = ({ method }) => {
  return method === "login" ? (
    <Link to="/register">
      Don't have an account?{" "}
      <span className="text-blue-500 underline">Register</span>
    </Link>
  ) : (
    <Link to="/login">
      Already have an account?{" "}
      <span className="text-blue-500 underline">Login</span>
    </Link>
  );
};

export default AuthLink;
