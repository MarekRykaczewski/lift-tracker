import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

interface AuthFormProps {
  route: string;
  method: "login" | "register";
}

function AuthForm({ route, method }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    try {
      const data = { username, password };
      if (method === "register") {
        data.email = email;
      }

      const res = await api.post(route, data);
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="flex max-w-md w-full flex-col border self-center ml-auto mr-auto rounded-sm"
      onSubmit={handleSubmit}
    >
      <div className="border-b border-gray-100 p-6">
        <h1 className="font-bold text-2xl uppercase mb-2">{name}</h1>
        <p className="text-gray-400 uppercase text-xs mb-2 font-bold">
          Sign in to your account
        </p>
      </div>
      <div className="flex flex-col p-6 gap-5">
        <div className="flex flex-col gap-1">
          <label
            className="uppercase mb-2 text-xs font-bold text-gray-400"
            htmlFor="username"
          >
            Your username
          </label>
          <input
            name="username"
            className="border-2 px-2 py-2 text-sm rounded-sm placeholder:text-gray-300"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>

        {method === "register" && (
          <div className="flex flex-col">
            <label
              className="uppercase mb-2 text-xs font-bold text-gray-400"
              htmlFor="email"
            >
              Your email
            </label>
            <input
              className="border-2 px-2 py-2 text-sm rounded-sm placeholder:text-gray-300"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
        )}
        <div className="flex flex-col">
          <label
            className="uppercase mb-2 text-xs font-bold text-gray-400"
            htmlFor="password"
          >
            Your password
          </label>
          <input
            className="border-2 px-2 py-2 text-sm rounded-sm placeholder:text-gray-300"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        {loading && <p>Loading...</p>}
        <button
          className="bg-blue-500 text-sm text-white rounded-sm py-4"
          type="submit"
        >
          {name}
        </button>
      </div>
    </form>
  );
}

export default AuthForm;
