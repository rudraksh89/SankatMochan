import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthCard from "./AuthCard";
import PasswordInput from "./PasswordInput";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     setLoading(true);

  //     const response = await api.post("/auth/register", {
  //       fullName,
  //       email,
  //       phone,
  //       password,
  //     });

  //     localStorage.setItem("token", response.data.token);

  //     setUser(response.data.user);

  //     alert(response.data.message);

  //     navigate("/dashboard");

  //   } catch (error) {

  //     alert(
  //       error.response?.data?.message || "Registration Failed"
  //     );

  //   } finally {

  //     setLoading(false);

  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Register button clicked");

  try {
    setLoading(true);

    console.log("Sending request...");

    const response = await api.post("/auth/register", {
      fullName,
      email,
      phone,
      password,
    });

    console.log("Response:", response.data);

    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);

    alert(response.data.message);

    navigate("/dashboard");

  } catch (error) {
    console.log(error);
    console.log(error.response);

    alert(error.response?.data?.message || "Registration Failed");

  } finally {
    console.log("Finally block");
    setLoading(false);
  }
};

  return (
    <section className="min-h-screen bg-slate-100 flex items-center justify-center px-5">

      <AuthCard>

        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Join Sankat Mochan
        </p>

        <form className="mt-8" onSubmit={handleSubmit}>

          <label className="font-semibold">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter Full Name"
            className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <div className="mt-5">

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

          </div>

          <div className="mt-5">

            <label className="font-semibold">
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="Enter Phone Number"
              className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

          </div>

          <div className="mt-5">

            <label className="font-semibold">
              Password
            </label>

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-7 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p className="text-center mt-6">

          Already have an account?

          <Link
            to="/login"
            className="text-blue-600 ml-2"
          >
            Login
          </Link>

        </p>

      </AuthCard>

    </section>
  );
};

export default RegisterForm;