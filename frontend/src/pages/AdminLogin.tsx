import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
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
      if (form.username === "admin" && form.password === "admin123") {
        const adminToken = "admin_token_" + Date.now();
        const adminUser = {
          id: "admin",
          email: "admin@medique.com",
          full_name: "Admin",
          role: "admin",
          user_type: "doctor",
        };

        localStorage.setItem("accessToken", adminToken);
        localStorage.setItem("refreshToken", "");
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("user", JSON.stringify(adminUser));

        // Force full reload so AuthProvider picks up user
        window.location.href = "/admin";
      } else {
        setError("Invalid username or password. Use admin / admin123");
      }
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ textAlign: "center", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "420px", padding: "40px", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.2em", color: "#1a3a52", marginBottom: "8px" }}>⚙️ Admin</h1>
          <h2 style={{ fontSize: "1.6em", color: "#0066cc", marginBottom: "16px" }}>Login</h2>
          <p style={{ color: "#666", marginBottom: 0 }}>Access the admin dashboard</p>
        </div>

        {error && (
          <div style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.95em", fontWeight: "600" }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#1a3a52" }}>Username</label>
            <input name="username" value={form.username} onChange={handleChange} required placeholder="admin" style={{ width: "100%", padding: "12px 16px", border: "2px solid #e0e6ed", borderRadius: "8px" }} />
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#1a3a52" }}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••••" style={{ width: "100%", padding: "12px 16px", border: "2px solid #e0e6ed", borderRadius: "8px" }} />
          </div>

          <button type="submit" disabled={loading} style={{ padding: "14px", fontSize: "1.05em", fontWeight: 700, background: "linear-gradient(135deg,#0066cc 0%,#0052a3 100%)", color: "white", border: "none", borderRadius: "8px" }}>
            {loading ? "🔄 Logging in..." : "🔓 Login"}
          </button>
        </form>

        <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e0e6ed" }}>
          <p style={{ color: "#666", marginBottom: 0 }}>
            Looking for patient login? <Link to="/role-selection" style={{ color: "#0066cc", fontWeight: 700, textDecoration: "none" }}>Go to login page</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
