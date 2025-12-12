import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function DoctorLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form.email, form.password, "doctor");
      navigate("/admin");
    } catch (err) {
      setError((err as Error).message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ textAlign: "center", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: "420px",
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.2em", color: "#1a3a52", marginBottom: "8px" }}>👨‍⚕️ Doctor</h1>
          <h2 style={{ fontSize: "1.6em", color: "#0066cc", marginBottom: "16px" }}>Login</h2>
          <p style={{ color: "#666", marginBottom: 0 }}>Welcome back, Doctor! Please login to your account</p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "0.95em",
              fontWeight: "600",
            }}
          >
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#1a3a52" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="doctor@hospital.com"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e0e6ed",
                borderRadius: "8px",
                fontSize: "1em",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#0066cc";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 102, 204, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e0e6ed";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#1a3a52" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e0e6ed",
                borderRadius: "8px",
                fontSize: "1em",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#0066cc";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 102, 204, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e0e6ed";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              fontSize: "1.05em",
              fontWeight: "700",
              marginTop: "8px",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "🔄 Logging in..." : "🔓 Login as Doctor"}
          </button>
        </form>

        <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e0e6ed" }}>
          <p style={{ color: "#666", marginBottom: "12px" }}>
            Don't have an account?{" "}
            <Link
              to="/doctor/signup"
              style={{
                color: "#0066cc",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Sign up here
            </Link>
          </p>
          <p style={{ color: "#666", marginBottom: 0 }}>
            Are you a patient?{" "}
            <Link
              to="/patient/login"
              style={{
                color: "#16a34a",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Login as Patient
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
