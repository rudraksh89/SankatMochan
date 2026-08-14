import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthCard from "./AuthCard";
import PasswordInput from "./PasswordInput";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Save JWT Token
      localStorage.setItem("token", response.data.token);

      // Save User in Context
      setUser(response.data.user);

      alert(response.data.message);

      // Redirect to Dashboard
      navigate("/dashboard");

    } catch (error) {

      alert(
        error.response?.data?.message || "Login Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <section className="min-h-screen bg-slate-100 flex items-center justify-center px-5">

      <AuthCard>

        <h1 className="text-3xl font-bold text-center">
          Welcome Back
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Login to Sankat Mochan
        </p>

        <form
          className="mt-8"
          onSubmit={handleSubmit}
        >

          <label className="font-semibold">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter Email"
            className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="mt-5">

            <label className="font-semibold">
              Password
            </label>

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          <div className="flex justify-end mt-3">

            <Link
              to="/forgot-password"
              className="text-blue-600"
            >
              Forgot Password?
            </Link>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging In..." : "Login"}
          </button>

        </form>

        <p className="text-center mt-6">

          Don't have an account?

          <Link
            to="/register"
            className="text-blue-600 ml-2"
          >
            Register
          </Link>

        </p>

      </AuthCard>

    </section>
  );
};

export default LoginForm;