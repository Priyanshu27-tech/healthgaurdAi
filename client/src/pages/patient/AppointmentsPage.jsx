import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Plus,
  XCircle,
  CheckCircle2,
  AlertCircle,
  MapPin,
  CalendarCheck,
} from 'lucide-react';
import { patientService, doctorService, appointmentService } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';

export const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Booking Form State
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [appRes, docRes] = await Promise.all([
        patientService.getAppointments(),
        doctorService.getDoctors(),
      ]);
      if (appRes.data.success) setAppointments(appRes.data.appointments);
      if (docRes.data.success) setDoctors(docRes.data.doctors);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!doctorId || !date || !time || !reason) {
      setError('Please fill in doctor, date, time slot, and reason.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await appointmentService.create({
        doctorId,
        date,
        time,
        reason,
        notes,
      });

      if (res.data.success) {
        setSuccess('Appointment successfully scheduled!');
        setBookModalOpen(false);
        // Reset form
        setDoctorId('');
        setDate('');
        setReason('');
        setNotes('');
        await loadData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentService.cancel(id);
      setSuccess('Appointment cancelled.');
      await loadData();
    } catch (err) {
      alert('Failed to cancel appointment.');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading appointments..." />;
  }

  const upcomingAppointments = appointments.filter((a) => a.status === 'Scheduled');
  const pastAppointments = appointments.filter((a) => a.status !== 'Scheduled');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Appointments</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your doctor consultations, clinical visits, and follow-ups.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          size="sm"
          onClick={() => {
            setError('');
            setBookModalOpen(true);
          }}
        >
          Book Consultation
        </Button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center shadow-soft-sm">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Upcoming Consultations */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center">
          <Calendar className="w-4 h-4 mr-1.5 text-health-600" />
          Scheduled Upcoming Visits ({upcomingAppointments.length})
        </h2>

        {upcomingAppointments.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No upcoming appointments"
            description="You do not currently have any visits scheduled. You can book an appointment with our registered healthcare providers anytime."
            actionLabel="Schedule Appointment"
            actionIcon={Plus}
            onAction={() => setBookModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingAppointments.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft hover:shadow-soft-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-clinical-50 text-clinical-700 flex items-center justify-center font-bold text-xs border border-clinical-200">
                        MD
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {app.doctorId?.name || 'Dr. Sarah Chen, MD'}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {app.doctorId?.email || 'Attending Physician'}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                      Confirmed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs mb-3">
                    <div className="flex items-center text-slate-700">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      <span className="font-semibold">{app.date}</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      <span className="font-semibold">{app.time}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-2">
                    <span className="font-semibold text-slate-700">Reason: </span>
                    {app.reason}
                  </p>
                  {app.notes && (
                    <p className="text-[11px] text-slate-500 italic mb-2">
                      Notes: {app.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:bg-rose-50"
                    onClick={() => handleCancel(app._id)}
                  >
                    Cancel Appointment
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Appointment History */}
      {pastAppointments.length > 0 && (
        <div className="pt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Past Consultation History
          </h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Date</th>
                    <th className="py-3 px-4">Physician</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pastAppointments.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-800 whitespace-nowrap">
                        {app.date} • {app.time}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        {app.doctorId?.name || 'Physician'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{app.reason}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadgeClass(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Book Consultation Modal */}
      <Modal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        title="Schedule Clinical Consultation"
        subtitle="Select a certified practitioner and choose an appointment time"
      >
        <form onSubmit={handleBookAppointment} className="space-y-4">
          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

          <Select
            label="Select Doctor / Specialist"
            name="doctorId"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            options={doctors.map((d) => ({
              value: d._id,
              label: `${d.name} (${d.profile?.specialization || 'Cardiology & Internal Medicine'})`,
            }))}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Consultation Date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <Select
              label="Preferred Time Slot"
              name="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              options={[
                '09:00 AM',
                '09:30 AM',
                '10:00 AM',
                '10:30 AM',
                '11:00 AM',
                '11:30 AM',
                '02:00 PM',
                '02:30 PM',
                '03:00 PM',
                '03:30 PM',
                '04:00 PM',
              ]}
              required
            />
          </div>

          <Input
            label="Reason for Visit / Chief Complaint"
            name="reason"
            placeholder="e.g. Follow-up on blood pressure log, routine checkup"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Additional Notes for Physician (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any symptoms, questions, or specific concerns to discuss during the visit..."
              className="block w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-health-500"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setBookModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AppointmentsPage;
