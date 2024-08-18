import AuthForm from "../components/Forms/AuthForm";

const Login = () => {
  return (
    <div className="w-full h-full p-3 mt-auto mb-auto">
      <AuthForm route="/api/token/" method="login" />
    </div>
  );
};

export default Login;
