import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  HeartPulse,
  Calendar,
  ClipboardList,
  FolderHeart,
  ArrowRight,
  CheckCircle2,
  Clock,
  Plus,
  TrendingUp,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/api';
import HealthMetricCard from '../../components/common/HealthMetricCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PredictionPanel from '../../components/common/PredictionPanel';
import { formatDate, formatDateTime, getStatusBadgeClass } from '../../utils/formatters';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profRes, assRes, appRes, recRes] = await Promise.all([
          patientService.getProfile(),
          patientService.getAssessments(),
          patientService.getAppointments(),
          patientService.getRecords(),
        ]);

        if (profRes.data.success) setProfile(profRes.data.profile);
        if (assRes.data.success) setAssessments(assRes.data.assessments);
        if (appRes.data.success) setAppointments(appRes.data.appointments);
        if (recRes.data.success) setRecords(recRes.data.records);
      } catch (err) {
        console.error('Error loading patient dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading your clinical overview..." />;
  }

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let score = 0;
    if (user?.name) score += 20;
    if (user?.phone) score += 15;
    if (profile?.height && profile?.weight) score += 25;
    if (profile?.bloodPressure) score += 20;
    if (profile?.emergencyContact?.phone) score += 20;
    return score;
  };

  const completionRate = calculateCompletion();
  const upcomingAppointment = appointments.find((a) => a.status === 'Scheduled');
  const recentAssessment = assessments[0];

  // Recharts Vital Trends History
  const vitalsChartData = [
    { date: 'Aug 10', systolic: 124, diastolic: 82, heartRate: 74 },
    { date: 'Aug 24', systolic: 120, diastolic: 80, heartRate: 71 },
    { date: 'Sep 02', systolic: 125, diastolic: 81, heartRate: 75 },
    { date: 'Sep 08', systolic: 122, diastolic: 79, heartRate: 70 },
    {
      date: 'Current',
      systolic: profile?.bloodPressure ? parseInt(profile.bloodPressure.split('/')[0]) || 122 : 122,
      diastolic: profile?.bloodPressure ? parseInt(profile.bloodPressure.split('/')[1]) || 80 : 80,
      heartRate: profile?.heartRate || 72,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Good morning, {user?.name || 'Patient'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Here's an overview of your health activity and clinical oversight.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/patient/assessment">
            <Button variant="primary" icon={Plus} size="sm">
              Start Assessment
            </Button>
          </Link>
          <Link to="/patient/appointments">
            <Button variant="outline" icon={Calendar} size="sm">
              Book Doctor
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-500">Profile Completion</span>
            <span className="text-xs font-bold text-health-600">{completionRate}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
            <div
              className="bg-health-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <Link
            to="/patient/profile"
            className="text-xs font-semibold text-health-700 hover:text-health-800 inline-flex items-center"
          >
            Update health details &rarr;
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-500">Upcoming Visit</span>
            <Calendar className="w-4 h-4 text-clinical-600" />
          </div>
          {upcomingAppointment ? (
            <div>
              <p className="text-sm font-bold text-slate-900">{upcomingAppointment.date}</p>
              <p className="text-xs text-slate-500 truncate">{upcomingAppointment.doctorId?.name || 'Assigned Physician'}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No scheduled visit</p>
          )}
          <Link
            to="/patient/appointments"
            className="text-xs font-semibold text-clinical-700 hover:text-clinical-800 inline-flex items-center mt-2"
          >
            Manage schedule &rarr;
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-500">Recent Assessment</span>
            <ClipboardList className="w-4 h-4 text-health-600" />
          </div>
          {recentAssessment ? (
            <div>
              <p className="text-sm font-bold text-slate-900">{formatDate(recentAssessment.submittedAt)}</p>
              <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded border capitalize ${getStatusBadgeClass(recentAssessment.status)}`}>
                {recentAssessment.status.replace('_', ' ')}
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No assessments yet</p>
          )}
          <Link
            to="/patient/assessments"
            className="text-xs font-semibold text-health-700 hover:text-health-800 inline-flex items-center mt-2"
          >
            View history &rarr;
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-500">Medical Records</span>
            <FolderHeart className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{records.length}</p>
          <Link
            to="/patient/records"
            className="text-xs font-semibold text-purple-700 hover:text-purple-800 inline-flex items-center mt-2"
          >
            Access documents &rarr;
          </Link>
        </div>
      </div>

      {/* Section A: Health Overview Vitals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center">
            <Activity className="w-4 h-4 mr-1.5 text-health-600" />
            Current Health Overview
          </h2>
          <span className="text-xs text-slate-400">Recorded during last consultation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <HealthMetricCard
            title="Blood Pressure"
            value={profile?.bloodPressure || '122/80'}
            unit="mmHg"
            status="Optimal"
            iconName="bp"
            trend="Stable baseline"
          />
          <HealthMetricCard
            title="Heart Rate"
            value={profile?.heartRate || 72}
            unit="bpm"
            status="Normal"
            iconName="heart"
            trend="Resting sinus"
          />
          <HealthMetricCard
            title="Body Weight"
            value={profile?.weight || 76}
            unit="kg"
            status="Normal"
            iconName="weight"
            trend="Target range"
          />
          <HealthMetricCard
            title="BMI Index"
            value={profile?.bmi || '24.0'}
            unit="kg/m²"
            status="Normal"
            iconName="scale"
            trend="18.5 - 24.9 Healthy"
          />
          <HealthMetricCard
            title="Blood Glucose"
            value={profile?.glucose || 94}
            unit="mg/dL"
            status="Normal"
            iconName="glucose"
            trend="Fasting level"
          />
        </div>
      </div>

      {/* Recharts Vital Sign Trends */}
      <Card
        title="Vital Parameter Longitudinal Trends"
        subtitle="Historical blood pressure and heart rate tracking over recent consultations"
        icon={TrendingUp}
      >
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={vitalsChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[50, 150]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="systolic"
                stroke="#0d9488"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSystolic)"
                name="Systolic BP (mmHg)"
              />
              <Area
                type="monotone"
                dataKey="heartRate"
                stroke="#0284c7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHeartRate)"
                name="Heart Rate (bpm)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Mid Grid: Large Assessment CTA Card + Upcoming Appointment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Health Assessment CTA Card */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-health-700 to-clinical-800 text-white p-6 sm:p-8 shadow-soft-md relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-semibold mb-3">
              <ClipboardList className="w-3.5 h-3.5 text-health-300" />
              <span>Routine Monitoring</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
              Complete a Health Assessment
            </h3>
            <p className="text-xs sm:text-sm text-health-100/90 max-w-lg leading-relaxed mb-6">
              Provide your latest health information, symptoms, and lifestyle indicators for clinical evaluation by your attending physician.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <Link to="/patient/assessment">
              <Button variant="outline" size="md" className="bg-white text-health-900 hover:bg-slate-50 border-none font-bold shadow-soft">
                Start Assessment
              </Button>
            </Link>
            <Link to="/patient/assessments" className="text-xs text-health-100 hover:text-white font-medium underline underline-offset-4">
              Review past submissions
            </Link>
          </div>
        </div>

        {/* Upcoming Appointment Card */}
        <Card
          title="Upcoming Appointment"
          subtitle="Clinical consultation"
          icon={Calendar}
          className="flex flex-col justify-between"
        >
          {upcomingAppointment ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-clinical-50 border border-clinical-100">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-clinical-600 text-white flex items-center justify-center font-bold text-xs">
                    MD
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      {upcomingAppointment.doctorId?.name || 'Dr. Sarah Chen, MD'}
                    </h5>
                    <p className="text-[11px] text-slate-500">Cardiology & Preventive Care</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-clinical-200/60">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Date</span>
                    <span className="font-semibold text-slate-800">{upcomingAppointment.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Time</span>
                    <span className="font-semibold text-slate-800">{upcomingAppointment.time}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Reason: </span>
                {upcomingAppointment.reason}
              </div>

              <Link to="/patient/appointments" className="block pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  View Appointment Details
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 mb-4">No upcoming appointments scheduled.</p>
              <Link to="/patient/appointments">
                <Button variant="outline" size="sm">
                  Schedule a Visit
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Lower Row: Recent Activity + Future ML Container Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <Card title="Recent Activity" subtitle="Timeline of medical submissions and clinical reviews" icon={Clock}>
          <div className="space-y-3 divide-y divide-slate-100">
            <div className="pt-2 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-health-100 text-health-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ClipboardList className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <p className="font-semibold text-slate-900">Assessment Submitted for Review</p>
                <p className="text-slate-500">Self-reported vital indicators and symptoms logged.</p>
                <span className="text-[10px] text-slate-400">Yesterday</span>
              </div>
            </div>

            <div className="pt-3 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FolderHeart className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <p className="font-semibold text-slate-900">Lab Diagnostic Document Archived</p>
                <p className="text-slate-500">Comprehensive Metabolic Panel & Lipid Profile added.</p>
                <span className="text-[10px] text-slate-400">12 days ago</span>
              </div>
            </div>

            <div className="pt-3 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-clinical-100 text-clinical-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Stethoscope className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <p className="font-semibold text-slate-900">Physician Clinical Guidance Finalized</p>
                <p className="text-slate-500">Dr. Sarah Chen verified normal physiological baseline.</p>
                <span className="text-[10px] text-slate-400">14 days ago</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Reusable Section 15 Prediction Panel Placeholder */}
        <PredictionPanel />
      </div>
    </div>
  );
};

export default PatientDashboard;
