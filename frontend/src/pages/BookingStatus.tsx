import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBooking } from "../api/api";

export default function BookingStatus() {
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    let interval: any;

    async function load() {
      const r = await getBooking(id!);
      if (r.ok) {
        setBooking(r.body);
        if (r.body.status !== "PENDING") clearInterval(interval);
      }
    }

    load();
    interval = setInterval(load, 3000);

    return () => clearInterval(interval);
  }, [id]);

  if (!booking)
    return (
      <div style={{ textAlign: "center", padding: "48px 20px" }}>
        <div className="loading">⏳ Loading your booking...</div>
      </div>
    );

  const isConfirmed = booking.status === "CONFIRMED";
  const isExpired = booking.status === "EXPIRED";

  return (
    <div style={{ textAlign: "center" }}>
      <h1>
        {isConfirmed ? "✅ Booking Confirmed!" : isExpired ? "❌ Booking Expired" : "⏳ Booking Pending"}
      </h1>

      <div
        style={{
          maxWidth: "500px",
          margin: "32px auto",
          padding: "32px",
          backgroundColor: isConfirmed ? "#ecfdf5" : isExpired ? "#fef2f2" : "#f0f9ff",
          borderRadius: "12px",
          border: `3px solid ${isConfirmed ? "#16a34a" : isExpired ? "#dc2626" : "#0066cc"}`,
          boxShadow: `0 4px 12px ${isConfirmed ? "rgba(22, 163, 74, 0.15)" : isExpired ? "rgba(220, 38, 38, 0.15)" : "rgba(0, 102, 204, 0.15)"}`,
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "1.8em",
              color: isConfirmed ? "#16a34a" : isExpired ? "#dc2626" : "#0066cc",
              marginBottom: "12px",
            }}
          >
            {isConfirmed ? "Great!" : isExpired ? "Oops!" : "Processing..."}
          </h2>
          <p style={{ fontSize: "1.1em", color: "#1a3a52", marginBottom: "16px" }}>
            <strong>Booking Status:</strong>
            <br />
            <span
              style={{
                display: "inline-block",
                marginTop: "8px",
                padding: "8px 16px",
                backgroundColor: isConfirmed ? "#dcfce7" : isExpired ? "#fee2e2" : "#dbeafe",
                borderRadius: "6px",
                fontWeight: "700",
                color: isConfirmed ? "#16a34a" : isExpired ? "#dc2626" : "#0066cc",
              }}
            >
              {booking.status}
            </span>
          </p>
        </div>

        <div style={{ textAlign: "left", backgroundColor: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
          <p style={{ margin: "8px 0", color: "#1a3a52" }}>
            <strong>📅 Appointment Expires:</strong> {new Date(booking.expires_at).toLocaleString()}
          </p>
          {booking.doctor_id && (
            <p style={{ margin: "8px 0", color: "#1a3a52" }}>
              <strong>👨‍⚕️ Doctor ID:</strong> {booking.doctor_id}
            </p>
          )}
          {booking.slot_id && (
            <p style={{ margin: "8px 0", color: "#1a3a52" }}>
              <strong>🕐 Slot ID:</strong> {booking.slot_id}
            </p>
          )}
        </div>

        {isConfirmed && (
          <p style={{ color: "#16a34a", fontWeight: "600", marginBottom: "20px" }}>
            Your appointment has been successfully booked! Check your email for details.
          </p>
        )}

        {isExpired && (
          <p style={{ color: "#dc2626", fontWeight: "600", marginBottom: "20px" }}>
            This booking has expired. Please go back and book another slot.
          </p>
        )}

        {!isConfirmed && !isExpired && (
          <p style={{ color: "#0066cc", fontWeight: "600", marginBottom: "20px" }}>
            Your booking is being processed. Please wait...
          </p>
        )}

        <Link to="/" style={{ display: "inline-block", padding: "12px 24px" }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
