import { useState, useEffect } from "react";
import { getPatients, getDoctorsAdmin, deletePatient, deleteDoctor, updatePatient, updateDoctor } from "../api/api";

export default function Admin() {
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"patients" | "doctors">("patients");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [patientsRes, doctorsRes] = await Promise.all([getPatients(), getDoctorsAdmin()]);
      if (patientsRes.ok) setPatients(patientsRes.body);
      if (doctorsRes.ok) setDoctors(doctorsRes.body);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(type: "patient" | "doctor", id: string) {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const res = type === "patient" ? await deletePatient(id) : await deleteDoctor(id);
      if (res.ok) {
        if (type === "patient") {
          setPatients(patients.filter((p) => p.id !== id));
        } else {
          setDoctors(doctors.filter((d) => d.id !== id));
        }
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  }

  async function handleSaveEdit(type: "patient" | "doctor", id: string) {
    try {
      const res = type === "patient" ? await updatePatient(id, editForm) : await updateDoctor(id, editForm);
      if (res.ok) {
        if (type === "patient") {
          setPatients(patients.map((p) => (p.id === id ? { ...p, ...editForm } : p)));
        } else {
          setDoctors(doctors.map((d) => (d.id === id ? { ...d, ...editForm } : d)));
        }
        setEditingId(null);
        setEditForm({});
      }
    } catch (err) {
      console.error("Error updating:", err);
    }
  }


  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ textAlign: "center", color: "#1a3a52", marginBottom: "40px" }}>📊 Admin Dashboard</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "32px", justifyContent: "center" }}>
        <button
          onClick={() => setActiveTab("patients")}
          style={{
            padding: "12px 28px",
            fontSize: "1.05em",
            fontWeight: "700",
            background: activeTab === "patients" ? "#0066cc" : "#f0f4f8",
            color: activeTab === "patients" ? "white" : "#666",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          👤 Patients ({patients.length})
        </button>
        <button
          onClick={() => setActiveTab("doctors")}
          style={{
            padding: "12px 28px",
            fontSize: "1.05em",
            fontWeight: "700",
            background: activeTab === "doctors" ? "#0066cc" : "#f0f4f8",
            color: activeTab === "doctors" ? "white" : "#666",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          👨‍⚕️ Doctors ({doctors.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", fontSize: "1.2em", color: "#666" }}>🔄 Loading...</div>
      ) : (
        <>
          {activeTab === "patients" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "24px",
              }}
            >
              {patients.length === 0 ? (
                <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#999" }}>No patients found</p>
              ) : (
                patients.map((patient) => (
                  <div
                    key={patient.id}
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      padding: "24px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                      border: "2px solid #e0e6ed",
                    }}
                  >
                    {editingId === patient.id ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={editForm.full_name || ""}
                          onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                          style={{
                            padding: "10px",
                            border: "2px solid #e0e6ed",
                            borderRadius: "6px",
                            fontSize: "0.95em",
                          }}
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={editForm.email || ""}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          style={{
                            padding: "10px",
                            border: "2px solid #e0e6ed",
                            borderRadius: "6px",
                            fontSize: "0.95em",
                          }}
                        />
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={editForm.is_active}
                            onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                          />
                          <span>Active</span>
                        </label>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleSaveEdit("patient", patient.id)}
                            style={{
                              flex: 1,
                              padding: "8px",
                              background: "#16a34a",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                          >
                            ✓ Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            style={{
                              flex: 1,
                              padding: "8px",
                              background: "#999",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 style={{ margin: "0 0 12px 0", color: "#1a3a52", fontSize: "1.2em" }}>
                          👤 {patient.full_name}
                        </h3>
                        <p style={{ margin: "4px 0", color: "#666" }}>
                          <strong>Email:</strong> {patient.email}
                        </p>
                        <p style={{ margin: "4px 0", color: "#666" }}>
                          <strong>Status:</strong> {patient.is_active ? "✅ Active" : "❌ Inactive"}
                        </p>
                        <p style={{ margin: "4px 0", color: "#666", fontSize: "0.9em" }}>
                          <strong>Registered:</strong> {new Date(patient.created_at).toLocaleDateString()}
                        </p>
                        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                          <button
                            onClick={() => {
                              setEditingId(patient.id);
                              setEditForm(patient);
                            }}
                            style={{
                              flex: 1,
                              padding: "8px",
                              background: "#0066cc",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete("patient", patient.id)}
                            style={{
                              flex: 1,
                              padding: "8px",
                              background: "#dc2626",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "doctors" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "24px",
              }}
            >
              {doctors.length === 0 ? (
                <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#999" }}>No doctors found</p>
              ) : (
                doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      padding: "24px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                      border: "2px solid #e0e6ed",
                    }}
                  >
                    {editingId === doctor.id ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={editForm.name || ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          style={{
                            padding: "10px",
                            border: "2px solid #e0e6ed",
                            borderRadius: "6px",
                            fontSize: "0.95em",
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Specialization"
                          value={editForm.specialization || ""}
                          onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                          style={{
                            padding: "10px",
                            border: "2px solid #e0e6ed",
                            borderRadius: "6px",
                            fontSize: "0.95em",
                          }}
                        />
                        <input
                          type="number"
                          placeholder="Experience Years"
                          value={editForm.experience_years || ""}
                          onChange={(e) => setEditForm({ ...editForm, experience_years: parseInt(e.target.value) })}
                          style={{
                            padding: "10px",
                            border: "2px solid #e0e6ed",
                            borderRadius: "6px",
                            fontSize: "0.95em",
                          }}
                        />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          <input
                            type="time"
                            value={editForm.daily_start_time || ""}
                            onChange={(e) => setEditForm({ ...editForm, daily_start_time: e.target.value })}
                            style={{
                              padding: "10px",
                              border: "2px solid #e0e6ed",
                              borderRadius: "6px",
                              fontSize: "0.95em",
                            }}
                          />
                          <input
                            type="time"
                            value={editForm.daily_end_time || ""}
                            onChange={(e) => setEditForm({ ...editForm, daily_end_time: e.target.value })}
                            style={{
                              padding: "10px",
                              border: "2px solid #e0e6ed",
                              borderRadius: "6px",
                              fontSize: "0.95em",
                            }}
                          />
                        </div>
                        <input
                          type="number"
                          placeholder="Slot Duration (minutes)"
                          value={editForm.slot_duration_minutes || ""}
                          onChange={(e) => setEditForm({ ...editForm, slot_duration_minutes: parseInt(e.target.value) })}
                          style={{
                            padding: "10px",
                            border: "2px solid #e0e6ed",
                            borderRadius: "6px",
                            fontSize: "0.95em",
                          }}
                        />
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleSaveEdit("doctor", doctor.id)}
                            style={{
                              flex: 1,
                              padding: "8px",
                              background: "#16a34a",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                          >
                            ✓ Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            style={{
                              flex: 1,
                              padding: "8px",
                              background: "#999",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 style={{ margin: "0 0 12px 0", color: "#1a3a52", fontSize: "1.2em" }}>
                          👨‍⚕️ {doctor.name}
                        </h3>
                        <p style={{ margin: "4px 0", color: "#0066cc", fontWeight: "600" }}>
                          {doctor.specialization}
                        </p>
                        <p style={{ margin: "4px 0", color: "#666" }}>
                          <strong>Experience:</strong> {doctor.experience_years} years
                        </p>
                        <p style={{ margin: "4px 0", color: "#666" }}>
                          <strong>Hours:</strong> {doctor.daily_start_time?.slice(0, 5)} - {doctor.daily_end_time?.slice(0, 5)}
                        </p>
                        <p style={{ margin: "4px 0", color: "#666" }}>
                          <strong>Slot Duration:</strong> {doctor.slot_duration_minutes} minutes
                        </p>
                        {doctor.email && (
                          <p style={{ margin: "4px 0", color: "#666", fontSize: "0.9em" }}>
                            <strong>Email:</strong> {doctor.email}
                          </p>
                        )}
                        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                          <button
                            onClick={() => {
                              setEditingId(doctor.id);
                              setEditForm(doctor);
                            }}
                            style={{
                              flex: 1,
                              padding: "8px",
                              background: "#0066cc",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete("doctor", doctor.id)}
                            style={{
                              flex: 1,
                              padding: "8px",
                              background: "#dc2626",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

