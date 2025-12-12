import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function DoctorSignup() {
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    specialization: "",
    experience_years: "",
    daily_start_time: "09:00",
    daily_end_time: "17:00",
    slot_duration_minutes: "20",
  });
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
      // Validate required fields
      if (!form.email || !form.password || !form.full_name || !form.specialization || 
          !form.experience_years || !form.daily_start_time || !form.daily_end_time || !form.slot_duration_minutes) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      const doctorDetails = {
        specialization: form.specialization,
        experienceYears: parseInt(form.experience_years),
        dailyStartTime: form.daily_start_time,
        dailyEndTime: form.daily_end_time,
        slotDurationMinutes: parseInt(form.slot_duration_minutes),
      };

      await signup(form.email, form.password, form.full_name, "doctor", doctorDetails);
      // Auto-login after signup
      await login(form.email, form.password, "doctor");
      navigate("/admin");
    } catch (err) {
      setError((err as Error).message || "Signup failed");
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
          <h2 style={{ fontSize: "1.6em", color: "#0066cc", marginBottom: "16px" }}>Sign Up</h2>
          <p style={{ color: "#666", marginBottom: 0 }}>Create your doctor account to manage your practice</p>
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
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="Dr. John Doe"
              value={form.full_name}
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
              Password (Min. 8 characters)
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
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
              Specialization (Department)
            </label>
            <input
              type="text"
              name="specialization"
              placeholder="e.g., Cardiology, Dermatology"
              value={form.specialization}
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
              Years of Experience
            </label>
            <input
              type="number"
              name="experience_years"
              placeholder="e.g., 5"
              value={form.experience_years}
              onChange={handleChange}
              required
              min="0"
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ textAlign: "left" }}>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#1a3a52" }}>
                Clinic Start Time
              </label>
              <input
                type="time"
                name="daily_start_time"
                value={form.daily_start_time}
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
                Clinic End Time
              </label>
              <input
                type="time"
                name="daily_end_time"
                value={form.daily_end_time}
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
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#1a3a52" }}>
              Appointment Slot Duration (minutes) - Must be 10-20 minutes
            </label>
            <input
              type="number"
              name="slot_duration_minutes"
              placeholder="e.g., 15"
              value={form.slot_duration_minutes}
              onChange={handleChange}
              required
              min="10"
              max="20"
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
            {loading ? "🔄 Creating account..." : "✨ Create Account"}
          </button>
        </form>

        <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e0e6ed" }}>
          <p style={{ color: "#666", marginBottom: "12px" }}>
            Already have an account?{" "}
            <Link
              to="/doctor/login"
              style={{
                color: "#0066cc",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Login here
            </Link>
          </p>
          <p style={{ color: "#666", marginBottom: 0 }}>
            Are you a patient?{" "}
            <Link
              to="/patient/signup"
              style={{
                color: "#16a34a",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Sign up as Patient
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
