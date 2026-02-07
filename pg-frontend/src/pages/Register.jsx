import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!name || !email || !password) {
      setMessage("All fields are required");
      setLoading(false);
      return;
    }

    try {
      await API.post("/auth/register", { name, email, password, role });
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded w-96">
        <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>

        {message && (
          <div
            className={`p-3 mb-4 rounded text-center ${
              message.includes("successful")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={submit}>
          <input
            className="border p-3 w-full mb-3 rounded"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="border p-3 w-full mb-3 rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="border p-3 w-full mb-3 rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="mb-4">
            <label className="block font-semibold mb-2">Register as:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="student"
                  checked={role === "student"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span>Student</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="owner"
                  checked={role === "owner"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span>Owner (PG)</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 w-full rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <a href="/" className="text-blue-600 font-semibold hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
