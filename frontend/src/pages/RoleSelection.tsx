import { Link } from "react-router-dom";

export default function RoleSelection() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0066cc 0%, #16a34a 100%)",
        padding: "20px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "800px" }}>
        <h1 style={{ fontSize: "3.5em", color: "white", marginBottom: "16px" }}>🏥 MediQueue</h1>
        <p style={{ fontSize: "1.3em", color: "rgba(255, 255, 255, 0.9)", marginBottom: "48px" }}>
          Healthcare appointment booking system
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
            marginBottom: "48px",
          }}
        >
          {/* Doctor Card */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "40px 32px",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 20px 48px rgba(0, 102, 204, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.15)";
            }}
          >
            <div style={{ fontSize: "4em", marginBottom: "20px" }}>👨‍⚕️</div>
            <h2 style={{ fontSize: "1.8em", color: "#1a3a52", marginBottom: "12px" }}>Doctor</h2>
            <p style={{ color: "#666", marginBottom: "28px", lineHeight: "1.6" }}>
              Manage your practice, create appointment slots, and track patient bookings
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Link
                to="/doctor/login"
                style={{
                  display: "block",
                  padding: "14px",
                  backgroundColor: "#0066cc",
                  color: "white",
                  borderRadius: "8px",
                  fontWeight: "700",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  fontSize: "1.05em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0052a3";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#0066cc";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                🔐 Login
              </Link>
              <Link
                to="/doctor/signup"
                style={{
                  display: "block",
                  padding: "14px",
                  backgroundColor: "white",
                  color: "#0066cc",
                  border: "2px solid #0066cc",
                  borderRadius: "8px",
                  fontWeight: "700",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  fontSize: "1.05em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e6f0ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                ✨ Sign Up
              </Link>
            </div>
          </div>

          {/* Patient Card */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "40px 32px",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 20px 48px rgba(22, 163, 74, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.15)";
            }}
          >
            <div style={{ fontSize: "4em", marginBottom: "20px" }}>👤</div>
            <h2 style={{ fontSize: "1.8em", color: "#1a3a52", marginBottom: "12px" }}>Patient</h2>
            <p style={{ color: "#666", marginBottom: "28px", lineHeight: "1.6" }}>
              Browse doctors, check available slots, and book your appointments easily
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Link
                to="/patient/login"
                style={{
                  display: "block",
                  padding: "14px",
                  backgroundColor: "#16a34a",
                  color: "white",
                  borderRadius: "8px",
                  fontWeight: "700",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  fontSize: "1.05em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#15803d";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#16a34a";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                🔐 Login
              </Link>
              <Link
                to="/patient/signup"
                style={{
                  display: "block",
                  padding: "14px",
                  backgroundColor: "white",
                  color: "#16a34a",
                  border: "2px solid #16a34a",
                  borderRadius: "8px",
                  fontWeight: "700",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  fontSize: "1.05em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f0fdf4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                ✨ Sign Up
              </Link>
            </div>
          </div>
        </div>

        <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.95em" }}>
          © 2025 MediQueue. All rights reserved.
        </p>
      </div>
    </div>
  );
}
