import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  User,
  ClipboardList,
  FolderHeart,
  Calendar,
  Bell,
  Settings,
  Users,
  LogOut,
  X,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/formatters';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isDoctor, logout } = useAuth();
  const navigate = useNavigate();

  const patientLinks = [
    { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/patient/profile', label: 'Health Profile', icon: User },
    { to: '/patient/assessments', label: 'Assessments', icon: ClipboardList },
    { to: '/patient/records', label: 'Medical Records', icon: FolderHeart },
    { to: '/patient/appointments', label: 'Appointments', icon: Calendar },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/doctor/patients', label: 'Patients', icon: Users },
    { to: '/doctor/assessments', label: 'Assessments Queue', icon: ClipboardList },
    { to: '/doctor/appointments', label: 'Appointments', icon: Calendar },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/doctor/profile', label: 'Doctor Profile', icon: Stethoscope },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const links = isDoctor ? doctorLinks : patientLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
            <NavLink to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-health-700 to-clinical-500 text-white flex items-center justify-center shadow-soft">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div className="flex items-center">
                <span className="text-lg font-bold tracking-tight text-slate-900">HealthGuard</span>
                <span className="text-[10px] font-semibold text-health-600 bg-health-50 px-1.5 py-0.5 rounded ml-1.5 border border-health-200">
                  AI
                </span>
              </div>
            </NavLink>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <div className="px-3 py-4 space-y-1">
            <div className="px-3 pb-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {isDoctor ? 'Clinical Workspace' : 'Patient Workspace'}
              </p>
            </div>

            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? isDoctor
                          ? 'bg-clinical-50 text-clinical-800 font-semibold shadow-soft-sm border border-clinical-200/60'
                          : 'bg-health-50 text-health-800 font-semibold shadow-soft-sm border border-health-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon
                    className={`w-4 h-4 mr-3 flex-shrink-0`}
                  />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* User profile footer info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 m-2 rounded-xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-health-600 to-clinical-600 text-white text-xs font-bold flex items-center justify-center shadow-soft-sm">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-500 capitalize">{user?.role} Portal</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 transition-colors border border-slate-200/80 bg-white"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
