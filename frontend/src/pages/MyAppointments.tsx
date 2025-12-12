import { useEffect, useState } from 'react';
import { getMyBookings, cancelBooking } from '../api/api';
import { useAuth } from '../contexts/AuthContext';

export default function MyAppointments() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const r = await getMyBookings();
    if (r.ok) setBookings(r.body);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCancel(id: string) {
    if (!confirm('Cancel this appointment?')) return;
    const r = await cancelBooking(id);
    if (r.ok) {
      alert('Cancelled');
      load();
    } else {
      alert('Cancel failed');
    }
  }

  if (!user) return <div style={{ padding: 24 }}>Please login as patient to view appointments.</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>My Appointments</h2>
      {loading ? (
        <div>Loading...</div>
      ) : bookings.length === 0 ? (
        <div>No appointments found.</div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {bookings.map((b) => (
            <div key={b.id} style={{ padding: 12, borderRadius: 8, background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{b.doctor_name} — {b.specialization}</div>
                <div>{new Date(b.slot_time).toLocaleString()}</div>
                <div style={{ color: '#666' }}>{b.status}</div>
              </div>
              <div>
                <button onClick={() => handleCancel(b.id)} style={{ padding: '8px 12px', fontWeight: 700 }}>Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
