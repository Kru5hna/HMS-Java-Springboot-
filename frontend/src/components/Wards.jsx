import React, { useState } from 'react';
import { Filter } from 'lucide-react';

function Wards({ beds, patients, handleBedCleaningComplete, setSelectedPatient, setActiveTab }) {
  const [filterWard, setFilterWard] = useState('All');

  const filtered = beds.filter(b => {
    return filterWard === 'All' ? true : b.ward === filterWard;
  });

  // Hardcoded ward list replaced — now derived dynamically from actual bed data.
  // Any new wards added in the backend will automatically appear here.
  const wardNames = [...new Set(beds.map(b => b.ward))];

  return (
    <div className="flex-column gap-lg" style={{ display: 'flex' }}>
      <div className="filter-bar">
        <div className="filter-actions">
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <select 
            className="filter-select"
            value={filterWard}
            onChange={(e) => setFilterWard(e.target.value)}
          >
            <option value="All">All Hospital Wards</option>
            <option value="ICU">Intensive Care Unit (ICU)</option>
            <option value="Pediatric Ward">Pediatric Ward</option>
            <option value="General Ward">General Ward</option>
            <option value="Emergency Room">Emergency Room</option>
          </select>
        </div>
      </div>

      {wardNames
        .filter(ward => filterWard === 'All' ? true : ward === filterWard)
        .map(wardName => {
          const wardBeds = filtered.filter(b => b.ward === wardName);
          return (
            <div key={wardName} className="premium-card ward-section">
              <div className="ward-title-row">
                <h3>{wardName} Floor Layout</h3>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Occupancy: {wardBeds.filter(b => b.status === 'Occupied').length} / {wardBeds.length} Beds
                </span>
              </div>

              <div className="bed-grid">
                {wardBeds.map(bed => {
                  const patient = patients.find(p => p.id === bed.occupiedById);
                  return (
                    <div 
                      key={bed.id} 
                      className={`bed-card ${
                        bed.status === 'Available' ? 'bed-available' : 
                        bed.status === 'Occupied' ? 'bed-occupied' : 'bed-cleaning'
                      }`}
                      onClick={() => {
                        if (patient) {
                          setSelectedPatient(patient);
                          setActiveTab('patients');
                        }
                      }}
                    >
                      <span className="bed-number">Bed {bed.number}</span>
                      <span className={`bed-status badge ${
                        bed.status === 'Available' ? 'badge-success' : 
                        bed.status === 'Occupied' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {bed.status}
                      </span>
                      {patient ? (
                        <span className="bed-patient" style={{ fontWeight: 600 }}>{patient.name}</span>
                      ) : bed.status === 'Cleaning' ? (
                        <button 
                          className="btn btn-secondary btn-sm" 
                          style={{ padding: '2px 6px', fontSize: '9px', marginTop: '6px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBedCleaningComplete(bed.id);
                          }}
                        >
                          Complete Clean
                        </button>
                      ) : (
                        <span className="bed-patient" style={{ color: 'var(--text-muted)' }}>Vacant</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Wards;
