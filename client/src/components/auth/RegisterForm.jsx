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

  const [accountType, setAccountType] = useState("normal");

  const [profession, setProfession] = useState("");
  const [organization, setOrganization] = useState("");
  const [professionalId, setProfessionalId] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        fullName,
        email,
        phone,
        password,
        accountType,
        profession:
          accountType === "responder"
            ? profession
            : "",
        organization:
          accountType === "responder"
            ? organization
            : "",
        professionalId:
          accountType === "responder"
            ? professionalId
            : "",
      });

      localStorage.setItem(
        "token",
        response.data.token
      );

      setUser(response.data.user);

      alert(response.data.message);

      navigate("/dashboard");

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-100 flex items-center justify-center px-5 py-10">

      <AuthCard>

        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Join Sankat Mochan
        </p>

        <form
          className="mt-8"
          onSubmit={handleSubmit}
        >

          {/* Full Name */}

          <label className="font-semibold">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter Full Name"
            className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            required
          />

          {/* Email */}

          <div className="mt-5">

            <label className="font-semibold">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter Email"
              className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          {/* Phone */}

          <div className="mt-5">

            <label className="font-semibold">
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="Enter Phone Number"
              className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              required
            />

          </div>

          {/* Password */}

          <div className="mt-5">

            <label className="font-semibold">
              Password
            </label>

            <PasswordInput
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>

          {/* Account Type */}

          <div className="mt-6">

            <label className="font-semibold">
              Account Type
            </label>

            <div className="grid grid-cols-2 gap-3 mt-3">

              <button
                type="button"
                onClick={() =>
                  setAccountType("normal")
                }
                className={`p-4 rounded-xl border-2 text-left transition ${
                  accountType === "normal"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p className="font-bold">
                  👤 Normal User
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Regular citizen
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setAccountType("responder")
                }
                className={`p-4 rounded-xl border-2 text-left transition ${
                  accountType === "responder"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p className="font-bold">
                  🛡️ Responder
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Doctor, police, etc.
                </p>
              </button>

            </div>

          </div>

          {/* Responder Fields */}

          {accountType === "responder" && (
            <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-2xl">

              <h3 className="font-bold text-lg">
                Responder Information
              </h3>

              <p className="text-sm text-gray-600 mt-1 mb-4">
                Your information will be reviewed
                by an administrator.
              </p>

              {/* Profession */}

              <label className="font-semibold">
                Profession
              </label>

              <select
                value={profession}
                onChange={(e) =>
                  setProfession(e.target.value)
                }
                className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 bg-white"
                required
              >

                <option value="">
                  Select Profession
                </option>

                <option value="Doctor">
                  Doctor
                </option>

                <option value="Police Officer">
                  Police Officer
                </option>

                <option value="Paramedic">
                  Paramedic
                </option>

                <option value="Firefighter">
                  Firefighter
                </option>

                <option value="Nurse">
                  Nurse
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

              {/* Organization */}

              <div className="mt-4">

                <label className="font-semibold">
                  Organization
                </label>

                <input
                  type="text"
                  placeholder="Hospital / Department / Organization"
                  value={organization}
                  onChange={(e) =>
                    setOrganization(e.target.value)
                  }
                  className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3"
                  required
                />

              </div>

              {/* Professional ID */}

              <div className="mt-4">

                <label className="font-semibold">
                  Professional ID
                </label>

                <input
                  type="text"
                  placeholder="Enter professional ID"
                  value={professionalId}
                  onChange={(e) =>
                    setProfessionalId(e.target.value)
                  }
                  className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3"
                  required
                />

              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">

                <p className="text-sm text-yellow-800">
                  ⚠️ Your responder account will remain
                  unverified until an administrator verifies
                  your professional credentials.
                </p>

              </div>

            </div>
          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-7 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Register"}
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