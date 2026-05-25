import React from 'react';
import { 
  Users, 
  Stethoscope, 
  Bed, 
  AlertCircle, 
  TrendingUp, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';

function Dashboard({ patients, doctors, beds, appointments, activities, setActiveTab }) {
  // Compute counts dynamically
  const admittedCount = patients.filter(p => p.status === 'Admitted').length;
  const activeDocs = doctors.filter(d => d.status === 'Available' || d.status === 'In Surgery').length;
  const availableBeds = beds.filter(b => b.status === 'Available').length;
  const cleaningBeds = beds.filter(b => b.status === 'Cleaning').length;

  // Department Occupancy Metrics
  const deptSummary = patients.reduce((acc, curr) => {
    if (curr.status === 'Admitted') {
      acc[curr.department] = (acc[curr.department] || 0) + 1;
    }
    return acc;
  }, {});

  const totalAdmitted = admittedCount;

  return (
    <div className="flex-column gap-lg" style={{ display: 'flex' }}>
      
      {/* 4 Quick Stat Cards */}
      <div className="stats-grid">
        <div className="premium-card stat-card">
          <div className="stat-content">
            <span className="stat-label">Admitted Patients</span>
            <span className="stat-value">{admittedCount}</span>
            <span className="stat-trend up"><TrendingUp size={12} /> Live Inpatients</span>
          </div>
          <div className="stat-icon-wrapper icon-primary">
            <Users size={20} />
          </div>
        </div>

        <div className="premium-card stat-card">
          <div className="stat-content">
            <span className="stat-label">Active Doctors</span>
            <span className="stat-value">{activeDocs}</span>
            <span className="stat-trend up"><UserCheck size={12} /> On-Duty Crew</span>
          </div>
          <div className="stat-icon-wrapper icon-secondary">
            <Stethoscope size={20} />
          </div>
        </div>

        <div className="premium-card stat-card">
          <div className="stat-content">
            <span className="stat-label">Beds Vacant</span>
            <span className="stat-value">{availableBeds}</span>
            <span className="stat-trend" style={{ color: 'var(--text-muted)' }}>
              Capacity: {beds.length}
            </span>
          </div>
          <div className="stat-icon-wrapper icon-success">
            <Bed size={20} />
          </div>
        </div>

        <div className="premium-card stat-card">
          <div className="stat-content">
            <span className="stat-label">Beds Cleaning</span>
            <span className="stat-value">{cleaningBeds}</span>
            <span className="stat-trend" style={{ color: 'var(--warning)' }}>
              Needs Release
            </span>
          </div>
          <div className="stat-icon-wrapper icon-warning">
            <AlertCircle size={20} />
          </div>
        </div>
      </div>

      {/* Main Grid: Info columns */}
      <div className="dashboard-grid">
        
        {/* Left column */}
        <div className="flex-column gap-lg" style={{ display: 'flex' }}>
          
          {/* Bed Map Preview */}
          <div className="premium-card">
            <div className="d-flex justify-between align-center" style={{ marginBottom: '16px' }}>
              <h3>Ward Space Quick Map</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('wards')}>
                Wards Board <ChevronRight size={14} />
              </button>
            </div>

            <div className="bed-grid">
              {beds.slice(0, 8).map(bed => {
                const occupant = patients.find(p => p.id === bed.occupiedById);
                return (
                  <div 
                    key={bed.id} 
                    className={`bed-card ${
                      bed.status === 'Available' ? 'bed-available' : 
                      bed.status === 'Occupied' ? 'bed-occupied' : 'bed-cleaning'
                    }`}
                    onClick={() => setActiveTab('wards')}
                  >
                    <span className="bed-number">{bed.ward} - {bed.number}</span>
                    <span className={`bed-status badge ${
                      bed.status === 'Available' ? 'badge-success' : 
                      bed.status === 'Occupied' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {bed.status}
                    </span>
                    {occupant && <span className="bed-patient">{occupant.name}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Department Distribution (Pure CSS) */}
          <div className="premium-card">
            <h3>Admitted Cases by Department</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Occupancy count split by active medicine specialties.
            </p>

            <div className="flex-column gap-md" style={{ display: 'flex' }}>
              {['Cardiology', 'Pediatrics', 'Neurology', 'Orthopedics', 'General Medicine'].map(dept => {
                const count = deptSummary[dept] || 0;
                const percentage = totalAdmitted > 0 ? (count / totalAdmitted) * 100 : 0;
                let color = 'var(--primary)';
                if (dept === 'Cardiology') color = 'var(--danger)';
                if (dept === 'Pediatrics') color = 'var(--secondary)';
                if (dept === 'Neurology') color = 'var(--info)';

                return (
                  <div key={dept} className="flex-column" style={{ display: 'flex', gap: '4px' }}>
                    <div className="d-flex justify-between" style={{ fontSize: '12px', fontWeight: 600 }}>
                      <span>{dept}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {count} Case{count !== 1 ? 's' : ''} ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <div className="custom-progress-container">
                      <div 
                        className="custom-progress-bar" 
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-column gap-lg" style={{ display: 'flex' }}>
          
          {/* Recent activities log */}
          <div className="premium-card" style={{ flexGrow: 1 }}>
            <h3>System Operations Audit</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Live administrative triggers from this browser session.
            </p>

            <div className="activity-list">
              {activities.map(act => (
                <div key={act.id} className="activity-row">
                  <div className="activity-bullet" style={{ 
                    backgroundColor: act.type === 'checkin' ? 'var(--primary)' : 
                                     act.type === 'doctor' ? 'var(--secondary)' : 
                                     act.type === 'bed' ? 'var(--warning)' : 'var(--info)'
                  }}></div>
                  <div className="activity-details">
                    <span className="activity-desc">{act.text}</span>
                    <span className="activity-time">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Appointments Today */}
          <div className="premium-card">
            <div className="d-flex justify-between align-center" style={{ marginBottom: '12px' }}>
              <h3>Awaiting Review</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('appointments')}>
                Review Appts
              </button>
            </div>

            <div className="activity-list">
              {appointments.filter(a => a.status === 'Pending').map(app => (
                <div key={app.id} className="activity-row">
                  <Clock size={14} style={{ color: 'var(--warning)', marginTop: '2px' }} />
                  <div className="activity-details">
                    <div className="d-flex justify-between">
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{app.patientName}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{app.time}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Clinician: {app.doctorName}
                    </span>
                  </div>
                </div>
              ))}
              {appointments.filter(a => a.status === 'Pending').length === 0 && (
                <div className="text-center" style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>
                  <CheckCircle2 size={20} style={{ color: 'var(--success)', margin: '0 auto 6px', display: 'block' }} />
                  All reviews processed!
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
