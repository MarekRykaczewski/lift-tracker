import React from "react";
import useAuthForm from "../../hooks/useAuthForm";
import AuthLink from "../AuthLink";
import ErrorNotification from "../UI/ErrorNotification";
import FormHeader from "../UI/FormHeader";
import InputField from "../UI/InputField";
import SubmitButton from "../UI/SubmitButton";

interface AuthFormProps {
  route: string;
  method: "login" | "register";
}

const AuthForm: React.FC<AuthFormProps> = ({ route, method }) => {
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
  const subtitle =
    method === "login" ? "Sign in to your account" : "Create an account";

  return (
    <form
      className="flex dark:bg-gray-800 bg-gray-100 dark:border-gray-600 max-w-md w-full flex-col border-2 self-center ml-auto mr-auto rounded-sm"
      onSubmit={handleSubmit}
    >
      <FormHeader title={name} subtitle={subtitle} />
      <div className="flex flex-col p-6 gap-5">
        {error && <ErrorNotification message={error} />}
        <InputField
          id="username"
          label="Your username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        {method === "register" && (
          <InputField
            id="email"
            label="Your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        )}
        <InputField
          id="password"
          label="Your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {loading && <p>Loading...</p>}
        <SubmitButton text={name} />
        <AuthLink method={method} />
      </div>
    </form>
  );
};

export default AuthForm;
