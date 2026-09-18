import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  ClipboardList,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertTriangle,
  Stethoscope,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { doctorService, appointmentService } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [patRes, assRes, appRes] = await Promise.all([
          doctorService.getPatients(),
          doctorService.getAssessments(),
          doctorService.getAppointments(),
        ]);

        if (patRes.data.success) setPatients(patRes.data.patients);
        if (assRes.data.success) setAssessments(assRes.data.assessments);
        if (appRes.data.success) setAppointments(appRes.data.appointments);
      } catch (err) {
        console.error('Doctor dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Initializing clinical workstation..." />;
  }

  const pendingAssessments = assessments.filter((a) => a.status === 'pending');
  const reviewedAssessments = assessments.filter((a) => a.status === 'reviewed');
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);

  // Volume trends chart data
  const volumeChartData = [
    { day: 'Mon', reviewed: 4, pending: 1 },
    { day: 'Tue', reviewed: 6, pending: 2 },
    { day: 'Wed', reviewed: 5, pending: 1 },
    { day: 'Thu', reviewed: 8, pending: 3 },
    { day: 'Fri', reviewed: 7, pending: 2 },
    { day: 'Today', reviewed: reviewedAssessments.length, pending: pendingAssessments.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome, {user?.name || 'Dr. Sarah Chen, MD'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Clinical Overview • Cardiology & Internal Medicine Workstation
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/doctor/patients">
            <Button variant="outline" icon={Users} size="sm">
              Patient Directory
            </Button>
          </Link>
          <Link to="/doctor/appointments">
            <Button variant="clinical" icon={Calendar} size="sm">
              Consultation Schedule
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-500">Total Patients</span>
            <Users className="w-4 h-4 text-clinical-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{patients.length}</p>
          <Link
            to="/doctor/patients"
            className="text-xs font-semibold text-clinical-700 hover:text-clinical-800 inline-flex items-center mt-2"
          >
            Inspect roster &rarr;
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-500">Pending Reviews</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          </div>
          <p className="text-2xl font-bold text-amber-700">{pendingAssessments.length}</p>
          <Link
            to="/doctor/assessments"
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 inline-flex items-center mt-2"
          >
            Review queue &rarr;
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-500">Today's Appointments</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{todayAppointments.length}</p>
          <Link
            to="/doctor/appointments"
            className="text-xs font-semibold text-purple-700 hover:text-purple-800 inline-flex items-center mt-2"
          >
            View daily schedule &rarr;
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-500">Completed Reviews</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{reviewedAssessments.length}</p>
          <span className="text-xs text-slate-400 mt-2 block">100% human doctor evaluated</span>
        </div>
      </div>

      {/* Main Section: Pending Patient Assessments Table */}
      <Card
        title="Pending Patient Assessments"
        subtitle="Incoming patient questionnaires awaiting your clinical evaluation and review notes"
        icon={ClipboardList}
        action={
          <Link to="/doctor/assessments">
            <Button variant="ghost" size="sm">
              View All Assessments
            </Button>
          </Link>
        }
      >
        {pendingAssessments.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">All assessments have been evaluated.</p>
            <p className="text-slate-400 mt-1">Your triage review queue is completely up to date.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-6">Patient</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">Reported Symptoms</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingAssessments.map((ass) => (
                  <tr key={ass._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">
                      {ass.patientId?.name || 'Patient'}
                      <span className="block text-[11px] font-normal text-slate-400">
                        {ass.patientId?.gender || 'N/A'} • {ass.patientId?.phone || ''}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                      {formatDate(ass.submittedAt)}
                    </td>
                    <td className="py-4 px-4 text-slate-700 max-w-xs">
                      {ass.symptoms?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {ass.symptoms.slice(0, 2).map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]"
                            >
                              {s}
                            </span>
                          ))}
                          {ass.symptoms.length > 2 && (
                            <span className="text-[11px] text-slate-400">
                              +{ass.symptoms.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">None reported</span>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        Pending Clinical Review
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <Button
                        variant="clinical"
                        size="sm"
                        icon={Stethoscope}
                        onClick={() => navigate(`/doctor/assessments/${ass._id}`)}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Assessment Volume Recharts Chart */}
      <Card
        title="Weekly Clinical Review Activity"
        subtitle="Assessment triage volume processed across the current week"
        icon={TrendingUp}
      >
        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="reviewed" fill="#0d9488" name="Clinically Reviewed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="#f59e0b" name="Pending in Queue" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
