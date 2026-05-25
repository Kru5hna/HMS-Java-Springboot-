import React, { useState } from 'react';
import { Search, Filter, Plus, Phone, Heart, Thermometer, X } from 'lucide-react';

function Patients({ 
  patients, 
  beds, 
  doctors, 
  setSelectedPatient, 
  handleDischargePatient, 
  showPatientModal, 
  setShowPatientModal, 
  handleRegisterPatient, 
  newPatient, 
  setNewPatient 
}) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Filter lists
  const filtered = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.contact.includes(search) || 
                          p.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' ? true : p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="premium-card">
      <div className="filter-bar">
        {/* Search */}
        <div className="search-input-wrapper">
          <Search />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by name, contact, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter & Register */}
        <div className="filter-actions">
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Admitted">Admitted</option>
            <option value="Outpatient">Outpatient</option>
            <option value="Discharged">Discharged</option>
          </select>
          <button className="btn btn-primary" onClick={() => setShowPatientModal(true)}>
            <Plus size={16} /> Register
          </button>
        </div>
      </div>

      {/* Patients Table */}
      <div className="table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Demographics</th>
              <th>Contact</th>
              <th>Consulting Unit</th>
              <th>Assigned Doctor</th>
              <th>Clinical Vitals</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(patient => (
              <tr key={patient.id} onClick={() => setSelectedPatient(patient)} style={{ cursor: 'pointer' }}>
                <td>
                  <div style={{ fontWeight: 600 }}>{patient.name}</div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: #{patient.id}</span>
                </td>
                <td>
                  <div>Age {patient.age} / {patient.gender}</div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Blood: {patient.bloodGroup}</span>
                </td>
                <td>
                  <div style={{ fontSize: '13px' }}><Phone size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {patient.contact}</div>
                </td>
                <td>{patient.department}</td>
                <td>
                  <div>{patient.doctorName}</div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Bed: {patient.bedId !== 'None' ? patient.bedId : 'Outpatient'}
                  </span>
                </td>
                <td>
                  {patient.status !== 'Discharged' ? (
                    <div className="d-flex align-center gap-sm" style={{ fontSize: '12px' }}>
                      <Heart size={11} className="patient-vitals-icon" style={{ color: 'var(--danger)' }} />
                      <span>{patient.vitals.pulse} bpm</span>
                      <span style={{ color: 'var(--text-muted)' }}>|</span>
                      <Thermometer size={11} style={{ color: 'var(--warning)' }} />
                      <span>{patient.vitals.temp}</span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Released</span>
                  )}
                </td>
                <td>
                  <span className={`badge ${
                    patient.status === 'Admitted' ? 'badge-danger pulse' : 
                    patient.status === 'Outpatient' ? 'badge-info' : 'badge-success'
                  }`}>
                    {patient.status}
                  </span>
                </td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="d-flex gap-sm justify-end" style={{ display: 'inline-flex' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setSelectedPatient(patient)}>
                      Open Chart
                    </button>
                    {patient.status === 'Admitted' && (
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDischargePatient(patient.id)}
                      >
                        Discharge
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center" style={{ padding: '32px', color: 'var(--text-muted)' }}>
                  No matching patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Patient Intake Registration Modal */}
      {showPatientModal && (
        <div className="overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Register New Patient Intake</h3>
              <button className="btn-icon-only" onClick={() => setShowPatientModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleRegisterPatient}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required
                    value={newPatient.name}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Age *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      required
                      value={newPatient.age}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, age: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select 
                      className="form-control"
                      value={newPatient.gender}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, gender: e.target.value }))}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select 
                      className="form-control"
                      value={newPatient.bloodGroup}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, bloodGroup: e.target.value }))}
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone *</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    required
                    value={newPatient.contact}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, contact: e.target.value }))}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Consulting Unit</label>
                    <select 
                      className="form-control"
                      value={newPatient.department}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, department: e.target.value }))}
                    >
                      <option value="General Medicine">General Medicine</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Primary Care Clinician</label>
                    <select 
                      className="form-control"
                      value={newPatient.doctorName}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, doctorName: e.target.value }))}
                    >
                      {doctors.map(d => (
                        <option key={d.id} value={d.name}>{d.name} ({d.spec})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Care Intake Status</label>
                    <select 
                      className="form-control"
                      value={newPatient.status}
                      onChange={(e) => {
                        const statusVal = e.target.value;
                        setNewPatient(prev => ({ 
                          ...prev, 
                          status: statusVal, 
                          bedId: statusVal === 'Admitted' ? beds.find(b => b.status === 'Available')?.id || 'None' : 'None' 
                        }));
                      }}
                    >
                      <option value="Outpatient">Outpatient</option>
                      <option value="Admitted">Admitted (Inpatient)</option>
                    </select>
                  </div>

                  {newPatient.status === 'Admitted' && (
                    <div className="form-group">
                      <label className="form-label">Bed Allocation *</label>
                      <select 
                        className="form-control"
                        value={newPatient.bedId}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, bedId: e.target.value }))}
                      >
                        <option value="None">No Bed Selected</option>
                        {beds.filter(b => b.status === 'Available').map(b => (
                          <option key={b.id} value={b.id}>{b.ward} - Bed {b.number}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Diagnosis Notes</label>
                  <textarea 
                    className="form-control" 
                    rows="2" 
                    value={newPatient.diagnosis}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, diagnosis: e.target.value }))}
                  ></textarea>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPatientModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Process Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Patients;
