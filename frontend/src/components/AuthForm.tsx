import { Link } from "react-router-dom";
import useAuthForm from "../hooks/useAuthForm";

interface AuthFormProps {
  route: string;
  method: "login" | "register";
}

function AuthForm({ route, method }: AuthFormProps) {
  const {
    username,
    setUsername,
    password,
    setPassword,
    email,
    setEmail,
    loading,
    error,
    handleSubmit,
  } = useAuthForm({ route, method });

  const name = method === "login" ? "Login" : "Register";

  return (
    <form
      className="flex dark:bg-gray-800 bg-gray-100 dark:border-gray-600 max-w-md w-full flex-col border-2 self-center ml-auto mr-auto rounded-sm"
      onSubmit={handleSubmit}
    >
      <div className="border-b border-gray-100 dark:border-gray-500 p-6">
        <h1 className="font-bold text-2xl uppercase mb-2">{name}</h1>
        <p className="text-gray-400 uppercase text-xs mb-2 font-bold">
          {method === "login" ? "Sign in to your account" : "Create an account"}
        </p>
      </div>
      <div className="flex flex-col p-6 gap-5">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-sm">{error}</div>
        )}
        <div className="flex flex-col gap-1">
          <label
            className="uppercase mb-2 text-xs font-bold text-gray-400"
            htmlFor="username"
          >
            Your username
          </label>
          <input
            name="username"
            className="border-2 dark:border-gray-600 px-2 py-2 text-sm rounded-sm dark:bg-gray-700 placeholder:text-gray-300"
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
              className="border-2 dark:border-gray-600 px-2 py-2 text-sm rounded-sm dark:bg-gray-700 placeholder:text-gray-300"
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
            className="border-2 dark:border-gray-600 px-2 py-2 text-sm rounded-sm dark:bg-gray-700 placeholder:text-gray-300"
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
        {method === "login" ? (
          <Link to={"/register"}>
            Don't have an account?{" "}
            <span className="text-blue-500 underline">Register</span>
          </Link>
        ) : (
          <Link to={"/login"}>
            Already have an account?{" "}
            <span className="text-blue-500 underline">Login</span>
          </Link>
        )}
      </div>
    </form>
  );
}

export default AuthForm;
