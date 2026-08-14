import AuthLayout from "../components/auth/AuthLayout";
import AuthIllustration from "../components/auth/AuthIllustration";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  return (
    <AuthLayout
      left={<AuthIllustration />}
      right={<LoginForm />}
    />
  );
};

export default Login;