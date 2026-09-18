import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Stethoscope,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/api';
import Badge from './Badge';
import { getInitials } from '../../utils/formatters';

export const Navbar = ({ onToggleSidebar, isPublic = false }) => {
  const { user, logout, isAuthenticated, isDoctor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobilePublicOpen, setMobilePublicOpen] = useState(false);

  // Fetch unread notifications if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const loadNotifications = async () => {
        try {
          const res = await notificationService.getAll();
          if (res.data.success) {
            setNotifications(res.data.notifications.slice(0, 5));
            setUnreadCount(res.data.unreadCount);
          }
        } catch (err) {
          // ignore notification polling error silently
        }
      };

      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  // Public Landing Page Navbar
  if (isPublic) {
    return (
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-soft-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-health-700 to-clinical-500 text-white flex items-center justify-center shadow-soft">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-slate-900">HealthGuard</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-health-600 bg-health-50 px-1.5 py-0.5 rounded ml-1.5 border border-health-200">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#home" className="hover:text-health-700 transition-colors">Home</a>
            <a href="#features" className="hover:text-health-700 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-health-700 transition-colors">How It Works</a>
            <a href="#patients" className="hover:text-health-700 transition-colors">For Patients</a>
            <a href="#doctors" className="hover:text-health-700 transition-colors">For Doctors</a>
            <a href="#about" className="hover:text-health-700 transition-colors">About</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <Link
                to={isDoctor ? '/doctor/dashboard' : '/patient/dashboard'}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-health-600 text-white hover:bg-health-700 transition-all shadow-soft"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-health-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-health-600 text-white hover:bg-health-700 transition-all shadow-soft"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobilePublicOpen(!mobilePublicOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            {mobilePublicOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobilePublicOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
            <a
              href="#home"
              onClick={() => setMobilePublicOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              Home
            </a>
            <a
              href="#features"
              onClick={() => setMobilePublicOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobilePublicOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              How It Works
            </a>
            <a
              href="#patients"
              onClick={() => setMobilePublicOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              For Patients
            </a>
            <a
              href="#doctors"
              onClick={() => setMobilePublicOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              For Doctors
            </a>
            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                to="/login"
                className="w-full text-center py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full text-center py-2 text-sm font-semibold text-white bg-health-600 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>
    );
  }

  // Authenticated Portal Header
  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 shadow-soft-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-slate-800 hidden sm:inline-block">
            {isDoctor ? 'Clinical Workstation' : 'Patient Care Portal'}
          </span>
          <Badge variant={isDoctor ? 'clinical' : 'primary'} size="sm">
            {isDoctor ? 'Physician Role' : 'Patient Role'}
          </Badge>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-soft-lg border border-slate-200 z-50 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-semibold text-slate-900">Notifications</h4>
                  {unreadCount > 0 && <Badge variant="danger" size="sm">{unreadCount} New</Badge>}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-health-600 hover:text-health-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">No recent notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => {
                        if (n.link) navigate(n.link);
                        setShowNotifications(false);
                      }}
                      className={`p-3 text-xs rounded-lg cursor-pointer transition-colors ${
                        n.read ? 'text-slate-600 hover:bg-slate-50' : 'bg-health-50/40 text-slate-900 font-medium hover:bg-health-50/70'
                      }`}
                    >
                      <p>{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-health-600 hover:text-health-700"
                >
                  View all notifications &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-health-600 to-clinical-600 text-white font-semibold text-xs flex items-center justify-center shadow-soft-sm">
              {getInitials(user?.name)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-none">{user?.name}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 capitalize">{user?.role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-soft-lg border border-slate-200 z-50 py-1.5">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <Link
                to={isDoctor ? '/doctor/profile' : '/patient/profile'}
                onClick={() => setShowUserMenu(false)}
                className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 mr-2 text-slate-400" />
                Profile Details
              </Link>
              <Link
                to="/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Stethoscope className="w-3.5 h-3.5 mr-2 text-slate-400" />
                Account Settings
              </Link>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
