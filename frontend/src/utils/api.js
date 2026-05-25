const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`API Error ${response.status}: ${response.statusText} - ${errorBody}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

// ── Patients ─────────────────────────────────────────────
export const patientsApi = {
  getAll: () => request('/patients'),
  getById: (id) => request(`/patients/${id}`),
  create: (data) => request('/patients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  discharge: (id) => request(`/patients/${id}/discharge`, { method: 'PATCH' }),
  addPrescription: (id, text) => request(`/patients/${id}/prescriptions`, { method: 'POST', body: JSON.stringify({ text }) }),
  delete: (id) => request(`/patients/${id}`, { method: 'DELETE' }),
};

// ── Doctors ──────────────────────────────────────────────
export const doctorsApi = {
  getAll: () => request('/doctors'),
  getById: (id) => request(`/doctors/${id}`),
  create: (data) => request('/doctors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/doctors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id, status) => request(`/doctors/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id) => request(`/doctors/${id}`, { method: 'DELETE' }),
};

// ── Appointments ─────────────────────────────────────────
export const appointmentsApi = {
  getAll: () => request('/appointments'),
  getById: (id) => request(`/appointments/${id}`),
  create: (data) => request('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id, status) => request(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id) => request(`/appointments/${id}`, { method: 'DELETE' }),
};

// ── Beds ─────────────────────────────────────────────────
export const bedsApi = {
  getAll: () => request('/beds'),
  getById: (id) => request(`/beds/${id}`),
  updateStatus: (id, status, occupiedById = null) =>
    request(`/beds/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, occupiedById }) }),
  cleaningComplete: (id) => request(`/beds/${id}/cleaning-complete`, { method: 'PATCH' }),
};

// ── Activities ───────────────────────────────────────────
export const activitiesApi = {
  getAll: () => request('/activities'),
};
