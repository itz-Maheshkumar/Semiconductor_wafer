import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { signup } from "../services/authService";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await signup(email, password, name);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", response.token);
      localStorage.setItem("userEmail", response.user.email);
      localStorage.setItem("userName", response.user.name || response.user.email);
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.error?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSignup}
        className="bg-slate-800 p-8 rounded-xl w-96 border border-slate-700"
      >
        <h1 className="text-3xl font-bold text-center mb-2 text-white">
          Semiconductor
        </h1>

        <p className="text-center text-slate-400 mb-8">
          Create Account
        </p>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 p-3 rounded bg-slate-700 text-white placeholder-slate-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-slate-700 text-white placeholder-slate-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded bg-slate-700 text-white placeholder-slate-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-slate-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
