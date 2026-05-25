import React, { useState } from 'react';
import { Search, Filter, Mail, Phone } from 'lucide-react';

function Doctors({ doctors, toggleDoctorStatus }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = doctors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                          d.spec.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' ? true : d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-column gap-lg" style={{ display: 'flex' }}>
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search doctors by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-actions">
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="In Surgery">In Surgery</option>
            <option value="Off-Duty">Off-Duty</option>
          </select>
        </div>
      </div>

      <div className="doctor-grid">
        {filtered.map(doc => (
          <div key={doc.id} className="premium-card doctor-card">
            <div className="doctor-avatar-section">
              <div className="doctor-avatar-circle">
                <span>{doc.name.split(' ')[1]?.[0] || 'Dr'}</span>
              </div>
              <div className="doctor-meta">
                <span className="doctor-name">{doc.name}</span>
                <span className="doctor-spec">{doc.spec}</span>
              </div>
            </div>

            <div className="d-flex justify-between align-center" style={{ fontSize: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Duty Status:</span>
              <span className={`badge ${
                doc.status === 'Available' ? 'badge-success' : 
                doc.status === 'In Surgery' ? 'badge-danger pulse' : 'badge-warning'
              }`}>
                {doc.status}
              </span>
            </div>

            <div className="doctor-stats">
              <div>
                <span className="doc-stat-lbl">Experience</span>
                <div className="doc-stat-val">{doc.exp}</div>
              </div>
              <div>
                <span className="doc-stat-lbl">Active Cases</span>
                <div className="doc-stat-val">{doc.patientsCount} patients</div>
              </div>
            </div>

            <div className="flex-column" style={{ display: 'flex', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span className="d-flex align-center gap-sm"><Mail size={11} /> {doc.email}</span>
              <span className="d-flex align-center gap-sm"><Phone size={11} /> {doc.contact}</span>
            </div>

            <button 
              className="btn btn-secondary btn-sm w-full"
              onClick={() => toggleDoctorStatus(doc.id)}
            >
              Cycle Duty Status
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center w-full" style={{ padding: '32px', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
            No matching doctors found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Doctors;
