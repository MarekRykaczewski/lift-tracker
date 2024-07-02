import AuthForm from "../components/AuthForm";

const Register = () => {
  return (
    <div className="w-full h-full p-3 mt-auto mb-auto">
      <AuthForm route="/api/user/register/" method="register" />
    </div>
  );
};

export default Register;
