import AuthForm from "../components/AuthForm";

const Login = () => {
  return <AuthForm route="/api/token/" method="login" />;
};

export default Login;
