import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Calendar, 
  Bed, 
  Activity, 
  Sun, 
  Moon 
} from 'lucide-react';

function Sidebar({ activeTab, setActiveTab, theme, toggleTheme }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'wards', label: 'Wards & Beds', icon: Bed },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <Activity size={20} />
        </div>
        <span className="logo-text">CareSync</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">JD</div>
          <div className="user-info">
            <span className="user-name">Jane Doe</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
        
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
