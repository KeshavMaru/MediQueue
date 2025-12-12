import { Link } from "react-router-dom";

export default function DoctorCard({ doctor }: { doctor: any }) {
  return (
    <div
      style={{
        padding: "24px",
        background: "white",
        borderRadius: "12px",
        border: "2px solid #e0e6ed",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        textAlign: "center",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-12px)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(0, 102, 204, 0.15)";
        e.currentTarget.style.borderColor = "#0066cc";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
        e.currentTarget.style.borderColor = "#e0e6ed";
      }}
    >
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            fontSize: "3.5em",
            marginBottom: "12px",
            display: "inline-block",
          }}
        >
          👨‍⚕️
        </div>
        <h3 style={{ margin: "12px 0", fontSize: "1.5em", color: "#1a3a52" }}>
          {doctor.name}
        </h3>
        <p
          style={{
            margin: "8px 0",
            color: "#0066cc",
            fontWeight: "600",
            fontSize: "1.05em",
          }}
        >
          {doctor.specialization || "General Medicine"}
        </p>
        <p style={{ margin: "4px 0", color: "#666", fontSize: "0.95em" }}>
          📅 {doctor.experience_years || "N/A"} years experience
        </p>
        {doctor.daily_start_time && doctor.daily_end_time && (
          <p style={{ margin: "4px 0", color: "#666", fontSize: "0.9em" }}>
            🕒 {doctor.daily_start_time.slice(0, 5)} - {doctor.daily_end_time.slice(0, 5)}
          </p>
        )}
        {doctor.slot_duration_minutes && (
          <p style={{ margin: "4px 0", color: "#666", fontSize: "0.9em" }}>
            ⏱️ {doctor.slot_duration_minutes} min slots
          </p>
        )}
      </div>

      <Link
        to={`/doctor/${doctor.id}`}
        style={{
          marginTop: "16px",
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#0066cc",
          color: "white",
          borderRadius: "8px",
          fontWeight: "600",
          textDecoration: "none",
          transition: "all 0.3s ease",
          cursor: "pointer",
          alignSelf: "center",
          width: "100%",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#0052a3";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#0066cc";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        View Slots →
      </Link>
    </div>
  );
}
