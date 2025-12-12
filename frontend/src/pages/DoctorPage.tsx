import { useEffect, useState } from "react";
import { getSlots, bookSlot, getDoctor, generateSlots } from "../api/api";
import SlotGrid from "../components/SlotGrid";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function DoctorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [doctor, setDoctor] = useState<any | null>(null);
  const { user } = useAuth();

  async function load() {
    setLoading(true);
    const r = await getSlots(id!);
    if (r.ok) setSlots(r.body);
    setLoading(false);
  }

  async function loadDoctor() {
    const r = await getDoctor(id!);
    if (r.ok) setDoctor(r.body);
  }

  useEffect(() => {
    load();
    loadDoctor();
  }, [id]);

    async function confirmBooking() {
    if (!selected) return;
    // Only patients may create bookings
    if (!user || user.user_type !== 'patient') {
      alert('Only patients can book appointments.');
      return;
    }

    const r = await bookSlot({
      doctor_id: id,
      slot_id: selected.id,
      patient_name: user.full_name || 'Patient',
      patient_contact: '',
    });

    if (r.ok) {
      navigate(`/booking/${r.body.booking_id}`);
    } else {
      alert("Booking failed! Slot may be taken.");
      load();
    }
  }

  async function handleGenerateSlots() {
    if (!id) return;
    const r = await generateSlots(id);
    if (r.ok) {
      await load();
      alert('Slots generated');
    } else {
      alert('Failed to generate slots');
    }
  }

  async function handleSelect(s: any) {
    setSelected(s);
    // If doctor and slot has a booking request, allow accept/decline
    if (user && user.user_type === 'doctor' && s.booking_id) {
      const ok = confirm(`Accept booking by ${s.patient_name} at ${new Date(s.slot_time).toLocaleString()}? Press Cancel to decline.`);
      const action = ok ? 'accept' : 'decline';
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/bookings/${s.booking_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Response saved');
        await load();
      } else {
        alert(data.error || 'Failed to respond');
      }
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>📅 Available Slots</h1>
      <p style={{ fontSize: "1.1em", color: "#666", marginBottom: "32px" }}>
        Click on a time slot to book your appointment
      </p>

      {loading ? (
        <div className="loading">
          ⏳ Loading available slots...
        </div>
      ) : slots.length === 0 ? (
        <p style={{ fontSize: "1.1em", color: "#999", padding: "32px" }}>
          No available slots for this doctor.
        </p>
      ) : (
        <div style={{ display: "flex", gap: "32px", maxWidth: "1200px", margin: "0 auto", alignItems: "flex-start" }}>
          <div style={{ width: '100%', textAlign: 'right', marginBottom: 12 }}>
            {(user && (user.role === 'admin' || (doctor && doctor.user_id === user.id))) && (
              <button onClick={handleGenerateSlots} style={{ padding: '8px 12px', fontWeight: 700 }}>
                ⚙️ Generate Slots
              </button>
            )}
          </div>
          {/* Slots Grid */}
          <div style={{ flex: 1 }}>
              <SlotGrid slots={slots} onSelect={(s) => handleSelect(s)} />
          </div>

          {/* Booking Summary Sidebar */}
          <div style={{ flex: "0 0 300px" }}>
            {selected ? (
              <div style={{
                padding: "24px",
                backgroundColor: "white",
                borderRadius: "12px",
                border: "3px solid #0066cc",
                boxShadow: "0 4px 12px rgba(0, 102, 204, 0.15)",
                position: "sticky",
                top: "20px",
              }}>
                <h2 style={{ color: "#0066cc", marginBottom: "16px", fontSize: "1.3em" }}>✅ Booking Summary</h2>
                <div style={{ backgroundColor: "#f0f9ff", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
                  <p style={{ fontSize: "0.95em", color: "#666", marginBottom: "4px" }}>Selected Time</p>
                  <p style={{ fontSize: "1.1em", color: "#1a3a52", fontWeight: "700", marginBottom: "8px" }}>
                    {new Date(selected.slot_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p style={{ fontSize: "0.95em", color: "#666" }}>
                    {new Date(selected.slot_time).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  onClick={confirmBooking}
                  style={{
                    padding: "14px 32px",
                    fontSize: "1em",
                    fontWeight: "700",
                    width: "100%",
                  }}
                >
                  🎯 Confirm Booking
                </button>
              </div>
            ) : (
              <div style={{
                padding: "24px",
                backgroundColor: "#f5f7fa",
                borderRadius: "12px",
                border: "2px dashed #ccc",
                textAlign: "center",
                position: "sticky",
                top: "20px",
              }}>
                <p style={{ fontSize: "1.1em", color: "#999", margin: 0 }}>
                  👈 Select a slot to confirm
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
  
}
