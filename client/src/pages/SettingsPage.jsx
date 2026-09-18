import React, { useState } from 'react';
import { Settings, Shield, Bell, Sliders, LogOut, CheckCircle2, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const SettingsPage = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('account');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  // Preference switches
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [reviewNotifications, setReviewNotifications] = useState(true);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordErr('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErr('New passwords do not match.');
      return;
    }
    setPasswordErr('');
    setPasswordMsg('Password security credentials successfully updated.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const tabs = [
    { id: 'account', label: 'Account Profile', icon: User },
    { id: 'security', label: 'Security & Password', icon: Shield },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'preferences', label: 'Application Preferences', icon: Sliders },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Account Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure personal account access, authentication security, and notification triggers.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-soft-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Account Profile Tab */}
      {activeTab === 'account' && (
        <Card title="Account Information" subtitle="Registered contact details" icon={User}>
          <div className="space-y-4 max-w-lg">
            <Input label="Full Name" value={user?.name || ''} disabled helperText="Contact support to update legal name" />
            <Input label="Registered Email" value={user?.email || ''} disabled />
            <Input label="Account Role" value={user?.role?.toUpperCase() || ''} disabled />
            <Input label="Phone Number" value={user?.phone || 'Not provided'} disabled />
          </div>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card title="Change Password" subtitle="Update authentication credentials" icon={Shield}>
          {passwordMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
              {passwordMsg}
            </div>
          )}

          {passwordErr && (
            <p className="mb-4 text-xs text-rose-600 font-medium">{passwordErr}</p>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              label="New Password"
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" size="md">
              Update Password
            </Button>
          </form>
        </Card>
      )}

      {/* Notification Preferences Tab */}
      {activeTab === 'notifications' && (
        <Card title="Notification Triggers" subtitle="Choose how you receive clinical updates" icon={Bell}>
          <div className="space-y-4 max-w-lg">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-900 block">Assessment Review Alerts</span>
                <span className="text-[11px] text-slate-500">Notify when doctor finishes evaluating an assessment</span>
              </div>
              <input
                type="checkbox"
                checked={reviewNotifications}
                onChange={(e) => setReviewNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-health-600 focus:ring-health-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-900 block">Consultation Reminders</span>
                <span className="text-[11px] text-slate-500">Receive 24-hour advance reminder for scheduled visits</span>
              </div>
              <input
                type="checkbox"
                checked={appointmentReminders}
                onChange={(e) => setAppointmentReminders(e.target.checked)}
                className="w-4 h-4 rounded text-health-600 focus:ring-health-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-900 block">Email Delivery</span>
                <span className="text-[11px] text-slate-500">Dispatch clinical summaries directly to your email</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-health-600 focus:ring-health-500"
              />
            </label>

            <Button variant="primary" size="sm" onClick={() => alert('Preferences saved.')}>
              Save Preferences
            </Button>
          </div>
        </Card>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <Card title="Display & Clinical Units" subtitle="Application measurement systems" icon={Sliders}>
          <div className="space-y-4 max-w-md text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Vital Measurement System</label>
              <select className="block w-full rounded-lg border border-slate-200 p-2 text-xs">
                <option>Metric (kg, cm, °C / °F, mmHg)</option>
                <option>Imperial (lbs, ft/in, °F, mmHg)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Timezone</label>
              <select className="block w-full rounded-lg border border-slate-200 p-2 text-xs">
                <option>UTC-05:00 Eastern Time (US & Canada)</option>
                <option>UTC-08:00 Pacific Time (US & Canada)</option>
                <option>UTC+00:00 Universal Coordinated Time</option>
                <option>UTC+05:30 Indian Standard Time</option>
              </select>
            </div>

            <Button variant="primary" size="sm" onClick={() => alert('Display preferences saved.')}>
              Save System Settings
            </Button>
          </div>
        </Card>
      )}

      {/* Logout Box */}
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-rose-900">Sign Out of Session</h4>
          <p className="text-[11px] text-rose-700 mt-0.5">
            Safely terminate your authenticated session on this browser device.
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          icon={LogOut}
          onClick={() => {
            logout();
            window.location.assign('/login');
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
