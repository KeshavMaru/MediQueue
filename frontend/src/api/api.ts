const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function fetchJSON(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("accessToken");
  const headers: any = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: { ...headers, ...opts.headers },
  });

  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  return { ok: res.ok, status: res.status, body };
}

// Doctors (public)
export function listDoctors() {
  return fetchJSON("/doctors");
}

// Doctors (admin)
export function createDoctor(data: any) {
  return fetchJSON("/admin/doctors", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function generateSlots(id: string) {
  return fetchJSON(`/doctors/${id}/generate-slots`, { method: "POST" });
}

// Get slots for a doctor (public)
export function getSlots(id: string) {
  return fetchJSON(`/doctors/${id}/slots`);
}

export function getDoctor(id: string) {
  return fetchJSON(`/doctors/${id}`);
}

// Booking
export function bookSlot(data: any) {
  return fetchJSON("/bookings/book", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getBooking(id: string) {
  return fetchJSON(`/bookings/${id}`);
}

export function getMyBookings() {
  return fetchJSON('/bookings/my');
}

export function cancelBooking(id: string) {
  return fetchJSON(`/bookings/${id}`, { method: 'DELETE' });
}

export function respondBooking(id: string, action: 'accept' | 'decline') {
  return fetchJSON(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ action }) });
}

// Admin routes
export function getPatients() {
  return fetchJSON("/admin/patients");
}

export function getDoctorsAdmin() {
  return fetchJSON("/admin/doctors");
}

export function deletePatient(id: string) {
  return fetchJSON(`/admin/patients/${id}`, { method: "DELETE" });
}

export function deleteDoctor(id: string) {
  return fetchJSON(`/admin/doctors/${id}`, { method: "DELETE" });
}

export function updatePatient(id: string, data: any) {
  return fetchJSON(`/admin/patients/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function updateDoctor(id: string, data: any) {
  return fetchJSON(`/admin/doctors/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
