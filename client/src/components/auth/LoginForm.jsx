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
    <section className="
      min-h-screen
      bg-slate-100 dark:bg-slate-950
      flex items-center justify-center
      px-5
      transition-colors duration-300
    ">

      <AuthCard>

        {/* Heading */}
        <h1 className="
          text-3xl
          font-bold
          text-center
          text-slate-900 dark:text-white
        ">
          Welcome Back
        </h1>

        <p className="
          text-gray-500 dark:text-slate-400
          text-center
          mt-2
        ">
          Login to Sankat Mochan
        </p>

        <form
          className="mt-8"
          onSubmit={handleSubmit}
        >

          {/* Email */}
          <label className="
            font-semibold
            text-slate-800 dark:text-white
          ">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter Email"
            className="
              w-full
              mt-2
              rounded-lg
              border border-gray-300 dark:border-slate-700
              bg-white dark:bg-slate-800
              text-slate-900 dark:text-white
              placeholder:text-gray-400 dark:placeholder:text-slate-500
              px-4 py-3
              outline-none
              focus:border-blue-600
              focus:ring-2
              focus:ring-blue-500/20
              transition
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <div className="mt-5">

            <label className="
              font-semibold
              text-slate-800 dark:text-white
            ">
              Password
            </label>

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mt-3">

            <Link
              to="/forgot-password"
              className="
                text-blue-600
                dark:text-blue-400
                hover:underline
              "
            >
              Forgot Password?
            </Link>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              mt-6
              bg-blue-600
              hover:bg-blue-700
              text-white
              py-3
              rounded-lg
              font-semibold
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Logging In..." : "Login"}
          </button>

        </form>

        {/* Register */}
        <p className="
          text-center
          mt-6
          text-slate-600 dark:text-slate-300
        ">
          Don't have an account?

          <Link
            to="/register"
            className="
              text-blue-600
              dark:text-blue-400
              ml-2
              hover:underline
            "
          >
            Register
          </Link>

        </p>

      </AuthCard>

    </section>
  );
};

export default LoginForm;