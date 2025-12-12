type Slot = {
  id: string;
  slot_time: string;
  status: string;
  booking_id?: string | null;
  patient_name?: string | null;
};

export default function SlotGrid({
  slots,
  onSelect,
}: {
  slots: Slot[];
  onSelect: (s: Slot) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: "16px",
        maxWidth: "800px",
        margin: "0 auto 32px",
      }}
    >
      {slots.map((s) => {
        const available = s.status === "AVAILABLE";
        const booked = !!s.booking_id;

        return (
            <button
            key={s.id}
            className={`slot ${available ? "available" : "unavailable"}`}
            style={{
              padding: "16px 12px",
              borderRadius: "10px",
              border: available ? "2px solid #0066cc" : "2px solid #e0e6ed",
              background: available ? "white" : "#f5f5f5",
              color: available ? "#1a3a52" : "#999",
              fontWeight: "700",
              cursor: available || booked ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              fontSize: "0.95em",
              lineHeight: "1.4",
              opacity: available ? 1 : 0.6,
            }}
            onClick={() => onSelect(s)}
            onMouseEnter={(e) => {
              if (available) {
                e.currentTarget.style.backgroundColor = "#e6f0ff";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 102, 204, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (available) {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            <div style={{ fontSize: "1.2em", marginBottom: "4px" }}>
              {available ? "🕐" : booked ? "👤" : "🔒"}
            </div>
            {new Date(s.slot_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            <br />
            {new Date(s.slot_time).toLocaleDateString()}
            {booked && s.patient_name && (
              <div style={{ marginTop: 8, fontSize: '0.85em', color: '#333', fontWeight: 700 }}>
                {s.patient_name}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
