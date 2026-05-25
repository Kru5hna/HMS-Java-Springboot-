import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import PatientDrawer from './components/PatientDrawer';
import Doctors from './components/Doctors';
import Appointments from './components/Appointments';
import Wards from './components/Wards';
import { 
  initialPatients, 
  initialDoctors, 
  initialBeds, 
  initialAppointments, 
  initialActivities 
} from './data/mockData';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Core Entity States
  const [patients, setPatients] = useState(initialPatients);
  const [doctors, setDoctors] = useState(initialDoctors);
  const [beds, setBeds] = useState(initialBeds);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [activities, setActivities] = useState(initialActivities);

  // Modal & Drawer Selection States
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  // Form states
  const [newPatient, setNewPatient] = useState({
    name: '', age: '', gender: 'Male', bloodGroup: 'O+', contact: '',
    department: 'General Medicine', status: 'Outpatient', bedId: 'None',
    doctorName: 'Dr. Maria Santos', diagnosis: ''
  });
  const [newAppointment, setNewAppointment] = useState({
    patientName: '', doctorName: 'Dr. Sarah Jenkins', date: '', time: '', reason: ''
  });

  const [newPrescriptionText, setNewPrescriptionText] = useState('');

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const logActivity = (text, type = 'general') => {
    setActivities(prev => [
      { id: Date.now(), text, time: "Just now", type },
      ...prev
    ]);
  };

  // Process Patient Intake
  const handleRegisterPatient = (e) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.age || !newPatient.contact) return;

    const assignedId = Date.now();
    const mockVitals = {
      bp: "120/80",
      pulse: 75 + Math.floor(Math.random() * 10),
      temp: "98.6°F",
      spo2: 98
    };

    const patientToAdd = {
      ...newPatient,
      id: assignedId,
      age: parseInt(newPatient.age),
      checkInDate: new Date().toISOString().split('T')[0],
      vitals: mockVitals,
      prescriptions: newPatient.diagnosis ? ["Initial Diagnostic Recommendations"] : []
    };

    if (patientToAdd.status === 'Admitted' && patientToAdd.bedId !== 'None') {
      setBeds(prev => prev.map(b => 
        b.id === patientToAdd.bedId ? { ...b, status: 'Occupied', occupiedById: assignedId } : b
      ));
      logActivity(`Admitted ${patientToAdd.name} to Bed ${patientToAdd.bedId} (${patientToAdd.department}).`, 'checkin');
    } else {
      patientToAdd.bedId = 'None';
      logActivity(`Registered outpatient ${patientToAdd.name} in General Clinic.`, 'checkin');
    }

    setPatients(prev => [patientToAdd, ...prev]);
    setShowPatientModal(false);
    setNewPatient({
      name: '', age: '', gender: 'Male', bloodGroup: 'O+', contact: '',
      department: 'General Medicine', status: 'Outpatient', bedId: 'None',
      doctorName: 'Dr. Maria Santos', diagnosis: ''
    });
  };

  // Book Appointment
  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!newAppointment.patientName || !newAppointment.date || !newAppointment.time) return;

    const appToAdd = {
      id: Date.now(),
      ...newAppointment,
      status: 'Pending'
    };

    setAppointments(prev => [appToAdd, ...prev]);
    logActivity(`Appointment booked for ${appToAdd.patientName} with ${appToAdd.doctorName}.`, 'appointment');
    setShowAppointmentModal(false);
    setNewAppointment({
      patientName: '', doctorName: 'Dr. Sarah Jenkins', date: '', time: '', reason: ''
    });
  };

  // Discharge Patient
  const handleDischargePatient = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    setPatients(prev => prev.map(p => 
      p.id === patientId ? { ...p, status: 'Discharged', bedId: 'None' } : p
    ));

    if (patient.bedId !== 'None') {
      setBeds(prev => prev.map(b => 
        b.id === patient.bedId ? { ...b, status: 'Cleaning', occupiedById: null } : b
      ));
      logActivity(`Discharged patient ${patient.name}. Bed ${patient.bedId} set to cleaning.`, 'bed');
    } else {
      logActivity(`Discharged outpatient ${patient.name}.`, 'checkin');
    }

    setSelectedPatient(prev => prev && prev.id === patientId ? { ...prev, status: 'Discharged', bedId: 'None' } : prev);
  };

  // Add Prescription
  const handleAddPrescription = () => {
    if (!newPrescriptionText.trim()) return;

    setPatients(prev => prev.map(p => {
      if (p.id === selectedPatient.id) {
        const updated = [...(p.prescriptions || []), newPrescriptionText];
        setSelectedPatient(current => ({ ...current, prescriptions: updated }));
        return { ...p, prescriptions: updated };
      }
      return p;
    }));

    logActivity(`Added prescription to ${selectedPatient.name}: "${newPrescriptionText}"`, 'general');
    setNewPrescriptionText('');
  };

  // Doctors availability
  const toggleDoctorStatus = (docId) => {
    const statuses = ['Available', 'In Surgery', 'Off-Duty'];
    setDoctors(prev => prev.map(d => {
      if (d.id === docId) {
        const nextStatus = statuses[(statuses.indexOf(d.status) + 1) % statuses.length];
        logActivity(`Dr. ${d.name.split(' ')[1]} is now ${nextStatus}.`, 'doctor');
        return { ...d, status: nextStatus };
      }
      return d;
    }));
  };

  // Appointments actions
  const handleUpdateAppointmentStatus = (id, nextStatus) => {
    setAppointments(prev => prev.map(app => {
      if (app.id === id) {
        logActivity(`Appointment for ${app.patientName} was ${nextStatus.toLowerCase()}.`, 'appointment');
        return { ...app, status: nextStatus };
      }
      return app;
    }));
  };

  // Sanitizing bed completion
  const handleBedCleaningComplete = (bedId) => {
    setBeds(prev => prev.map(b => {
      if (b.id === bedId) {
        logActivity(`Bed ${b.number} is sanitized and available.`, 'bed');
        return { ...b, status: 'Available' };
      }
      return b;
    }));
  };

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
