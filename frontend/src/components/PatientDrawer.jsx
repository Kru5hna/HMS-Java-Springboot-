import React from 'react';
import { X, Heart, Thermometer, FileText, CheckCircle2 } from 'lucide-react';

function PatientDrawer({ 
  selectedPatient, 
  setSelectedPatient, 
  handleDischargePatient, 
  newPrescriptionText, 
  setNewPrescriptionText, 
  handleAddPrescription 
}) {
  return (
    <div className="overlay" style={{ justifyContent: 'flex-end', alignItems: 'stretch' }} onClick={() => setSelectedPatient(null)}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h3 style={{ fontSize: '18px' }}>Clinical Patient File</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Status: {selectedPatient.status}</span>
          </div>
          <button className="btn-icon-only" onClick={() => setSelectedPatient(null)}>
            <X size={16} />
          </button>
        </div>

        <div className="drawer-body">
          {/* Card Summary */}
          <div className="premium-card" style={{ padding: '16px', background: 'var(--bg-app)' }}>
            <h2 style={{ fontSize: '16px', marginBottom: '4px' }}>{selectedPatient.name}</h2>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span>Demographics: Age {selectedPatient.age} / {selectedPatient.gender} (Blood Group: {selectedPatient.bloodGroup})</span>
              <span>Contact Phone: {selectedPatient.contact}</span>
              <span>Lead Care Unit: {selectedPatient.department}</span>
              <span>Lead Clinician: {selectedPatient.doctorName}</span>
              {selectedPatient.bedId !== 'None' && <span>Allocated Bed: <strong>{selectedPatient.bedId}</strong></span>}
            </div>
          </div>

          {/* Vitals Monitor */}
          {selectedPatient.status !== 'Discharged' ? (
            <div className="flex-column gap-sm" style={{ display: 'flex' }}>
              <div className="d-flex align-center gap-sm">
                <Heart size={14} className="patient-vitals-icon" style={{ color: 'var(--danger)' }} />
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Vitals Telemetry</h4>
              </div>
              <div className="vitals-grid">
                <div className="vital-card">
                  <span className="vital-title">Heart Pulse</span>
                  <span className="vital-value" style={{ color: 'var(--danger)' }}>
                    {selectedPatient.vitals.pulse} <span className="vital-unit">bpm</span>
                  </span>
                </div>
                <div className="vital-card">
                  <span className="vital-title">Temperature</span>
                  <span className="vital-value" style={{ color: 'var(--warning)' }}>
                    {selectedPatient.vitals.temp}
                  </span>
                </div>
                <div className="vital-card">
                  <span className="vital-title">Blood Pressure</span>
                  <span className="vital-value" style={{ color: 'var(--primary)' }}>
                    {selectedPatient.vitals.bp} <span className="vital-unit">mmHg</span>
                  </span>
                </div>
                <div className="vital-card">
                  <span className="vital-title">SpO2 Oxygen</span>
                  <span className="vital-value" style={{ color: 'var(--success)' }}>
                    {selectedPatient.vitals.spo2} <span className="vital-unit">%</span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="help-banner">
              <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
              <span>Telemetry closed. Patient released.</span>
            </div>
          )}

          {/* Diagnoses */}
          <div className="flex-column gap-sm" style={{ display: 'flex' }}>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Diagnosis notes</h4>
            <div className="premium-card" style={{ padding: '12px', fontSize: '13px', lineHeight: 1.5 }}>
              {selectedPatient.diagnosis || 'No diagnostic remarks added.'}
            </div>
          </div>

          {/* Prescription orders */}
          <div className="flex-column gap-sm" style={{ display: 'flex' }}>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Medication Prescribed</h4>
            <div className="premium-card" style={{ padding: '12px' }}>
              {selectedPatient.prescriptions && selectedPatient.prescriptions.length > 0 ? (
                <ul style={{ listStyleType: 'none', paddingLeft: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedPatient.prescriptions.map((pres, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '4px', borderBottom: '1px solid var(--border)' }}>
                      <FileText size={12} style={{ color: 'var(--primary)' }} />
                      <span>{pres}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center" style={{ color: 'var(--text-muted)', fontSize: '12px', padding: '10px' }}>
                  No active pharmaceutical directions assigned.
                </div>
              )}

              {/* Add New Prescription */}
              {selectedPatient.status !== 'Discharged' && (
                <div className="d-flex gap-sm" style={{ marginTop: '12px' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Type prescription..." 
                    style={{ fontSize: '12px' }}
                    value={newPrescriptionText}
                    onChange={(e) => setNewPrescriptionText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddPrescription(); }}
                  />
                  <button className="btn btn-primary btn-sm" onClick={handleAddPrescription}>
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Release Actions */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            {selectedPatient.status === 'Admitted' ? (
              <button 
                className="btn btn-danger w-full"
                onClick={() => handleDischargePatient(selectedPatient.id)}
              >
                Discharge & Free Bed Space
              </button>
            ) : selectedPatient.status === 'Discharged' ? (
              <div className="badge badge-success w-full text-center" style={{ padding: '8px', display: 'block' }}>
                Release File Closed
              </div>
            ) : (
              <div className="badge badge-info w-full text-center" style={{ padding: '8px', display: 'block' }}>
                Outpatient Status Active
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDrawer;
