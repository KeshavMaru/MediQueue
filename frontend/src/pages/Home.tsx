import { useDoctors } from "../contexts/DoctorsContext";
import DoctorCard from "../components/DoctorCard";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getDoctor, getSlots, generateSlots, respondBooking } from "../api/api";

export default function Home() {
  const { doctors, loadDoctors } = useDoctors();
  const { user } = useAuth();
  const [doctorData, setDoctorData] = useState<any | null>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load doctor's profile and slots
  useEffect(() => {
    if (user?.user_type === 'doctor') {
      loadDoctorData();
    }
  }, [user]);

  async function loadDoctorData() {
    setLoading(true);
    // Ensure doctors list is loaded (in case signup happened recently)
    let docList = doctors;
    if (!docList || docList.length === 0) {
      const fresh = await loadDoctors();
      docList = fresh || [];
    }

    // Find the doctor that belongs to this user
    const doctorList = (docList || []).filter((d: any) => d.user_id === user?.id);
    if (doctorList.length > 0) {
      const doctorId = doctorList[0].id;
      const docRes = await getDoctor(doctorId);
      if (docRes.ok) setDoctorData(docRes.body);

      const slotsRes = await getSlots(doctorId);
      if (slotsRes.ok) {
        setSlots(slotsRes.body);
        // Auto-generate slots if none exist
        if (slotsRes.body.length === 0) {
          const genRes = await generateSlots(doctorId);
          if (genRes.ok) {
            // Reload slots after generation
            const newSlotsRes = await getSlots(doctorId);
            if (newSlotsRes.ok) setSlots(newSlotsRes.body);
          }
        }
      }
    }
    setLoading(false);
  }

  async function handleGenerateSlots() {
    if (!doctorData) return;
    const res = await generateSlots(doctorData.id);
    if (res.ok) {
      alert('Slots generated');
      await loadDoctorData();
    } else {
      alert('Failed to generate slots');
    }
  }

  async function handleRespond(slot: any, action: 'accept' | 'decline') {
    if (!slot.booking_id) return;
    const res = await respondBooking(slot.booking_id, action);
    if (res.ok) {
      alert(action === 'accept' ? 'Booking accepted' : 'Booking declined');
      await loadDoctorData();
    } else {
      alert(`Failed to ${action} booking`);
    }
  }

  // Doctors view: show their profile and slots
  if (user?.user_type === 'doctor') {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1>👋 Welcome, Dr. {user.full_name}</h1>
          {doctorData && (
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '32px' }}>
              <p style={{ margin: '8px 0', fontSize: '1.1em', fontWeight: 700 }}>{doctorData.name}</p>
              <p style={{ margin: '4px 0', color: '#666' }}>{doctorData.specialization} • {doctorData.experience_years} years experience</p>
              <p style={{ margin: '4px 0', color: '#666' }}>Slot Duration: {doctorData.slot_duration_minutes} min</p>
              <button
                onClick={handleGenerateSlots}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  background: '#0066cc',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                ⚙️ Generate Slots
              </button>
            </div>
          )}

          <h2>📅 Your Slots</h2>
          {loading ? (
            <div>Loading slots...</div>
          ) : slots.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', background: '#f5f5f5', borderRadius: '12px' }}>
              No slots yet. Generate slots to get started!
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  style={{
                    padding: '16px',
                    background: slot.booking_id ? '#fff3cd' : 'white',
                    borderRadius: '12px',
                    border: `2px solid ${slot.booking_id ? '#ffc107' : '#e0e0e0'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1em' }}>
                      {new Date(slot.slot_time).toLocaleString()}
                    </div>
                    {slot.booking_id ? (
                      <div style={{ marginTop: '8px', color: '#666' }}>
                        <div>👤 <strong>{slot.patient_name}</strong> {slot.patient_contact && `(${slot.patient_contact})`}</div>
                        <div style={{ fontSize: '0.9em' }}>Status: <strong>{slot.booking_status || 'PENDING'}</strong></div>
                      </div>
                    ) : (
                      <div style={{ marginTop: '8px', color: '#0066cc', fontWeight: 700 }}>✅ Available</div>
                    )}
                  </div>

                  {slot.booking_id && slot.booking_status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleRespond(slot, 'accept')}
                        style={{
                          padding: '8px 12px',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        ✅ Accept
                      </button>
                      <button
                        onClick={() => handleRespond(slot, 'decline')}
                        style={{
                          padding: '8px 12px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        ❌ Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>👨‍⚕️ Find Your Doctor</h1>
      <p style={{ fontSize: "1.1em", color: "#666", marginBottom: "32px" }}>
        Browse and book appointments with our experienced healthcare professionals
      </p>

      {doctors.length === 0 ? (
        <p style={{ fontSize: "1.2em", color: "#999", marginTop: "48px" }}>
          No doctors available at the moment.
        </p>
      ) : (
        <div className="doctor-grid">
          {doctors.map((doc: any) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
