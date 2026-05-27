import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import PatientDrawer from './components/PatientDrawer';
import Doctors from './components/Doctors';
import Appointments from './components/Appointments';
import Wards from './components/Wards';
import { patientsApi, doctorsApi, appointmentsApi, bedsApi, activitiesApi } from './utils/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Core Entity States (loaded from backend)
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [beds, setBeds] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activities, setActivities] = useState([]);

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal & Drawer Selection States
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  // Form states
  // FIX F-01: Initialize doctorName as '' — the useEffect below syncs it to
  // the first doctor from the API once the list loads, so the select and the
  // submitted value always agree.
  const [newPatient, setNewPatient] = useState({
    name: '', age: '', gender: 'Male', bloodGroup: 'O+', contact: '',
    department: 'General Medicine', status: 'Outpatient', bedId: 'None',
    doctorName: '', diagnosis: ''
  });
  const [newAppointment, setNewAppointment] = useState({
    patientName: '', doctorName: '', date: '', time: '', reason: ''
  });

  const [newPrescriptionText, setNewPrescriptionText] = useState('');

  // ── Fetch all data from backend on mount ────────────────
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [patientsData, doctorsData, bedsData, appointmentsData, activitiesData] = await Promise.all([
        patientsApi.getAll(),
        doctorsApi.getAll(),
        bedsApi.getAll(),
        appointmentsApi.getAll(),
        activitiesApi.getAll(),
      ]);
      setPatients(patientsData);
      setDoctors(doctorsData);
      setBeds(bedsData);
      setAppointments(appointmentsData);
      setActivities(activitiesData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // FIX F-01: When the doctors list first populates (or changes), set the
  // default doctor in both forms only if not already explicitly chosen by the user.
  useEffect(() => {
    if (doctors.length === 0) return;
    const firstDoc = doctors[0].name;
    setNewPatient(prev => ({ ...prev, doctorName: prev.doctorName || firstDoc }));
    setNewAppointment(prev => ({ ...prev, doctorName: prev.doctorName || firstDoc }));
  }, [doctors]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // ── Process Patient Intake ──────────────────────────────
  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.age || !newPatient.contact) return;

    try {
      const requestBody = {
        name: newPatient.name,
        age: parseInt(newPatient.age),
        gender: newPatient.gender,
        bloodGroup: newPatient.bloodGroup,
        contact: newPatient.contact,
        status: newPatient.status,
        department: newPatient.department,
        bedId: newPatient.status === 'Admitted' && newPatient.bedId !== 'None' ? newPatient.bedId : null,
        doctorName: newPatient.doctorName,
        diagnosis: newPatient.diagnosis || null,
      };

      await patientsApi.create(requestBody);

      // If admitted with a bed, update bed status
      if (requestBody.status === 'Admitted' && requestBody.bedId) {
        // The backend may handle bed status update; we just refresh
      }

      // Refresh all data from backend to get the full picture
      await fetchAllData();

      setShowPatientModal(false);
      // FIX F-01: Reset form with the first doctor from the live list, not a hardcoded name.
      setNewPatient({
        name: '', age: '', gender: 'Male', bloodGroup: 'O+', contact: '',
        department: 'General Medicine', status: 'Outpatient', bedId: 'None',
        doctorName: doctors[0]?.name || '', diagnosis: ''
      });
    } catch (err) {
      console.error('Failed to register patient:', err);
      alert('Failed to register patient: ' + err.message);
    }
  };

  // ── Book Appointment ────────────────────────────────────
  // FIX F-02: The HTML <input type="time"> yields 24h strings like "14:30".
  // The backend/DB stores and displays 12h strings like "2:30 PM".
  // This helper converts between the two so all entries look consistent.
  const convertTo12Hour = (time24) => {
    if (!time24) return '';
    const [hourStr, minuteStr] = time24.split(':');
    let hours = parseInt(hourStr, 10);
    const minutes = minuteStr || '00';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convert 0 → 12 for midnight
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!newAppointment.patientName || !newAppointment.date || !newAppointment.time) return;

    try {
      await appointmentsApi.create({
        patientName: newAppointment.patientName,
        doctorName: newAppointment.doctorName,
        date: newAppointment.date,
        time: convertTo12Hour(newAppointment.time), // FIX F-02: Store as 12h AM/PM format
        reason: newAppointment.reason,
      });

      await fetchAllData();

      setShowAppointmentModal(false);
      // FIX F-01: Reset form with the first doctor from the live list, not a hardcoded name.
      setNewAppointment({
        patientName: '', doctorName: doctors[0]?.name || '', date: '', time: '', reason: ''
      });
    } catch (err) {
      console.error('Failed to book appointment:', err);
      alert('Failed to book appointment: ' + err.message);
    }
  };

  // ── Discharge Patient ───────────────────────────────────
  const handleDischargePatient = async (patientId) => {
    try {
      await patientsApi.discharge(patientId);
      await fetchAllData();

      // Update selected patient if it's the one being discharged
      setSelectedPatient(prev => {
        if (prev && prev.id === patientId) {
          return { ...prev, status: 'Discharged', bedId: 'None' };
        }
        return prev;
      });
    } catch (err) {
      console.error('Failed to discharge patient:', err);
      alert('Failed to discharge patient: ' + err.message);
    }
  };

  // ── Add Prescription ────────────────────────────────────
  const handleAddPrescription = async () => {
    if (!newPrescriptionText.trim() || !selectedPatient) return;

    try {
      const updatedPatient = await patientsApi.addPrescription(selectedPatient.id, newPrescriptionText);
      
      // Update the selected patient with the new data from backend
      setSelectedPatient(updatedPatient);
      
      // Refresh all data
      await fetchAllData();

      setNewPrescriptionText('');
    } catch (err) {
      console.error('Failed to add prescription:', err);
      alert('Failed to add prescription: ' + err.message);
    }
  };

  // ── Toggle Doctor Status ────────────────────────────────
  const toggleDoctorStatus = async (docId) => {
    const doctor = doctors.find(d => d.id === docId);
    if (!doctor) return;

    const statuses = ['Available', 'In Surgery', 'Off-Duty'];
    const nextStatus = statuses[(statuses.indexOf(doctor.status) + 1) % statuses.length];

    try {
      await doctorsApi.updateStatus(docId, nextStatus);
      await fetchAllData();
    } catch (err) {
      console.error('Failed to update doctor status:', err);
      alert('Failed to update doctor status: ' + err.message);
    }
  };

  // ── Update Appointment Status ───────────────────────────
  const handleUpdateAppointmentStatus = async (id, nextStatus) => {
    try {
      await appointmentsApi.updateStatus(id, nextStatus);
      await fetchAllData();
    } catch (err) {
      console.error('Failed to update appointment status:', err);
      alert('Failed to update appointment status: ' + err.message);
    }
  };

  // ── Bed Cleaning Complete ───────────────────────────────
  const handleBedCleaningComplete = async (bedId) => {
    try {
      await bedsApi.cleaningComplete(bedId);
      await fetchAllData();
    } catch (err) {
      console.error('Failed to update bed status:', err);
      alert('Failed to update bed status: ' + err.message);
    }
  };

  // ── Loading & Error States ──────────────────────────────
  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{
            width: '48px', height: '48px', border: '4px solid var(--border)',
            borderTop: '4px solid var(--primary)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
          }} />
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Loading CareSync...</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Connecting to hospital database</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', padding: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ color: 'var(--danger)', marginBottom: '12px' }}>Connection Error</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>{error}</p>
          <button className="btn btn-primary" onClick={fetchAllData}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      <main className="main-content">
        <header className="main-header">
          <div className="header-title-container">
            <h1 className="header-title">
              {activeTab === 'dashboard' && 'Control Board'}
              {activeTab === 'patients' && 'Patients Directory'}
              {activeTab === 'doctors' && 'Doctors Registry'}
              {activeTab === 'appointments' && 'Scheduler Panel'}
              {activeTab === 'wards' && 'Bed Allocation Board'}
            </h1>
            <span className="header-subtitle">
              {activeTab === 'dashboard' && 'Key overview of current clinic logistics.'}
              {activeTab === 'patients' && 'Search and inspect detailed active medical directories.'}
              {activeTab === 'doctors' && 'Manage availability shifts and specialties.'}
              {activeTab === 'appointments' && 'Manage consultation calendars.'}
              {activeTab === 'wards' && 'Visual status of ward beds and cleanings.'}
            </span>
          </div>
        </header>

        <div className="content-body">
          {activeTab === 'dashboard' && (
            <Dashboard 
              patients={patients} 
              doctors={doctors} 
              beds={beds} 
              appointments={appointments} 
              activities={activities}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'patients' && (
            <Patients 
              patients={patients} 
              beds={beds} 
              doctors={doctors}
              setSelectedPatient={setSelectedPatient} 
              handleDischargePatient={handleDischargePatient}
              showPatientModal={showPatientModal}
              setShowPatientModal={setShowPatientModal}
              handleRegisterPatient={handleRegisterPatient}
              newPatient={newPatient}
              setNewPatient={setNewPatient}
            />
          )}

          {activeTab === 'doctors' && (
            <Doctors 
              doctors={doctors} 
              toggleDoctorStatus={toggleDoctorStatus} 
            />
          )}

          {activeTab === 'appointments' && (
            <Appointments 
              appointments={appointments} 
              doctors={doctors} 
              handleUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              showAppointmentModal={showAppointmentModal}
              setShowAppointmentModal={setShowAppointmentModal}
              handleBookAppointment={handleBookAppointment}
              newAppointment={newAppointment}
              setNewAppointment={setNewAppointment}
            />
          )}

          {activeTab === 'wards' && (
            <Wards 
              beds={beds} 
              patients={patients} 
              handleBedCleaningComplete={handleBedCleaningComplete} 
              setSelectedPatient={setSelectedPatient}
              setActiveTab={setActiveTab}
            />
          )}
        </div>
      </main>

      {/* Slide-out Detail Drawer */}
      {selectedPatient && (
        <PatientDrawer 
          selectedPatient={selectedPatient} 
          setSelectedPatient={setSelectedPatient} 
          handleDischargePatient={handleDischargePatient}
          newPrescriptionText={newPrescriptionText}
          setNewPrescriptionText={setNewPrescriptionText}
          handleAddPrescription={handleAddPrescription}
        />
      )}
    </div>
  );
}

export default App;
