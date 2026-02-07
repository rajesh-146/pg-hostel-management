import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "owner") {
        navigate("/owner");
      } else {
        navigate("/student");
      }
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded w-96">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

        <input
          className="border p-3 w-full mb-3 rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-3 w-full mb-3 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="bg-blue-600 text-white p-3 w-full font-semibold rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 font-semibold hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
