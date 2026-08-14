import AuthLayout from "../components/auth/AuthLayout";
import AuthIllustration from "../components/auth/AuthIllustration";
import RegisterForm from "../components/auth/RegisterForm";

const Register = () => {
  return (
    <AuthLayout
      left={<AuthIllustration />}
      right={<RegisterForm />}
    />
  );
};

export default Register;