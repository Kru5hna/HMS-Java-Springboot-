import React from 'react';
import { Clock, Plus, X } from 'lucide-react';

function Appointments({ 
  appointments, 
  doctors, 
  handleUpdateAppointmentStatus, 
  showAppointmentModal, 
  setShowAppointmentModal, 
  handleBookAppointment, 
  newAppointment, 
  setNewAppointment 
}) {
  return (
    <div className="premium-card">
      <div className="filter-bar justify-end" style={{ display: 'flex', marginBottom: '16px' }}>
        <button className="btn btn-primary" onClick={() => setShowAppointmentModal(true)}>
          <Plus size={16} /> Book Appointment
        </button>
      </div>

      <div className="table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Assigned Consultant</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reason for Visit</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app.id}>
                <td style={{ fontWeight: 600 }}>{app.patientName}</td>
                <td>{app.doctorName}</td>
                <td>{app.date}</td>
                <td>
                  <div className="d-flex align-center gap-sm">
                    <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                    <span>{app.time}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '13px' }}>
                  "{app.reason}"
                </td>
                <td>
                  <span className={`badge ${
                    app.status === 'Confirmed' ? 'badge-success' : 
                    app.status === 'Pending' ? 'badge-warning' : 
                    app.status === 'Completed' ? 'badge-info' : 'badge-danger'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="text-right">
                  <div className="d-flex gap-sm justify-end" style={{ display: 'inline-flex' }}>
                    {app.status === 'Pending' && (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleUpdateAppointmentStatus(app.id, 'Confirmed')}
                      >
                        Approve
                      </button>
                    )}
                    {app.status !== 'Completed' && app.status !== 'Cancelled' && (
                      <>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleUpdateAppointmentStatus(app.id, 'Completed')}
                        >
                          Complete
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleUpdateAppointmentStatus(app.id, 'Cancelled')}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Appointment Scheduler Modal */}
      {showAppointmentModal && (
        <div className="overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Schedule Clinical Appointment</h3>
              <button className="btn-icon-only" onClick={() => setShowAppointmentModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleBookAppointment}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Patient Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required
                    placeholder="Enter patient full name"
                    value={newAppointment.patientName}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, patientName: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned Consultant *</label>
                  <select 
                    className="form-control"
                    value={newAppointment.doctorName}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, doctorName: e.target.value }))}
                  >
                    {doctors.map(d => (
                      <option key={d.id} value={d.name}>{d.name} ({d.spec})</option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Preferred Date *</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      required
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Time *</label>
                    <input 
                      type="time" 
                      className="form-control" 
                      required
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Reason for Appointment *</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    required
                    placeholder="State trigger symptoms..."
                    value={newAppointment.reason}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, reason: e.target.value }))}
                  ></textarea>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAppointmentModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;
