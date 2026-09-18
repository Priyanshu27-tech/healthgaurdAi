import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Search,
} from 'lucide-react';
import { doctorService, appointmentService } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';

export const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await doctorService.getAppointments();
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const openStatusModal = (app) => {
    setSelectedApp(app);
    setStatus(app.status);
    setNotes(app.notes || '');
    setModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setUpdating(true);
      const res = await appointmentService.update(selectedApp._id, {
        status,
        notes,
      });
      if (res.data.success) {
        setMsg(`Appointment marked as ${status}.`);
        setModalOpen(false);
        await loadAppointments();
      }
    } catch (err) {
      alert('Failed to update appointment status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading consultation schedule..." />;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayApps = appointments.filter((a) => a.date === todayStr);
  const upcomingApps = appointments.filter((a) => a.date > todayStr && a.status === 'Scheduled');
  const pastApps = appointments.filter((a) => a.date < todayStr || a.status !== 'Scheduled');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Consultation Schedule</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your daily patient consultation appointments and clinical visit outcomes.
          </p>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center shadow-soft-sm">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
          {msg}
        </div>
      )}

      {/* Today's Consultations */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center">
          <Clock className="w-4 h-4 mr-1.5 text-clinical-600" />
          Today's Scheduled Consultations ({todayApps.length})
        </h2>

        {todayApps.length === 0 ? (
          <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            No consultations booked for today.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayApps.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft hover:shadow-soft-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-900 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-clinical-600" />
                      {app.time}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeClass(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{app.patientId?.name}</h4>
                  <p className="text-xs text-slate-500 mb-3">{app.patientId?.phone || app.patientId?.email}</p>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3">
                    <span className="font-semibold text-slate-800">Reason: </span>
                    {app.reason}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <Button variant="secondary" size="sm" onClick={() => openStatusModal(app)}>
                    Update Status & Notes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Upcoming Consultations
        </h2>

        {upcomingApps.length === 0 ? (
          <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            No future appointments scheduled at this time.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-6">Date / Time</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Chief Reason</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {upcomingApps.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50">
                      <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">
                        {app.date} • {app.time}
                      </td>
                      <td className="py-4 px-4 text-slate-800 whitespace-nowrap">
                        <span className="font-bold">{app.patientId?.name}</span>
                        <span className="block text-[11px] text-slate-400">{app.patientId?.phone || ''}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">{app.reason}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusBadgeClass(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <Button variant="secondary" size="sm" onClick={() => openStatusModal(app)}>
                          Update Status
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Appointment History Modal */}
      {selectedApp && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Update Appointment Status"
          subtitle={`Patient: ${selectedApp.patientId?.name} • ${selectedApp.date} at ${selectedApp.time}`}
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Consultation Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-clinical-500"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Clinical Visit Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Record consultation discussion, diagnostic follow-ups, or instructions..."
                className="block w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-clinical-500"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={updating}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default DoctorAppointmentsPage;
