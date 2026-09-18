import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  User,
  ArrowLeft,
  Heart,
  Activity,
  Calendar,
  FolderHeart,
  ClipboardList,
  AlertTriangle,
  Stethoscope,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { doctorService } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import HealthMetricCard from '../../components/common/HealthMetricCard';
import PredictionPanel from '../../components/common/PredictionPanel';
import { formatDate, formatDateTime, getStatusBadgeClass } from '../../utils/formatters';

export const DoctorPatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [profile, setProfile] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatientChart = async () => {
      try {
        setLoading(true);
        const res = await doctorService.getPatientById(id);
        if (res.data.success) {
          setPatient(res.data.patient);
          setProfile(res.data.profile);
          setAssessments(res.data.assessments);
          setRecords(res.data.records);
          setAppointments(res.data.appointments);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load patient chart.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientChart();
  }, [id]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Retrieving patient electronic health record..." />;
  }

  if (error || !patient) {
    return (
      <div className="p-8 text-center">
        <p className="text-rose-600 font-semibold mb-4">{error || 'Patient not found'}</p>
        <Link to="/doctor/patients">
          <Button variant="secondary" icon={ArrowLeft}>
            Back to Patient Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <Link
            to="/doctor/patients"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{patient.name}</h1>
              <Badge variant="clinical" size="md">
                Patient Chart
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {patient.age ? `${patient.age} years old` : 'Age unknown'} • {patient.gender || 'Not specified'} • Phone: {patient.phone || 'N/A'} • Email: {patient.email}
            </p>
          </div>
        </div>
      </div>

      {/* Physiological Metrics Overview */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Current Baseline Health Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <HealthMetricCard
            title="Blood Pressure"
            value={profile?.bloodPressure || 'N/A'}
            unit="mmHg"
            iconName="bp"
            status="Normal"
          />
          <HealthMetricCard
            title="Heart Rate"
            value={profile?.heartRate || 'N/A'}
            unit="bpm"
            iconName="heart"
            status="Normal"
          />
          <HealthMetricCard
            title="Weight"
            value={profile?.weight || 'N/A'}
            unit="kg"
            iconName="weight"
            status="Normal"
          />
          <HealthMetricCard
            title="BMI"
            value={profile?.bmi || 'N/A'}
            unit="kg/m²"
            iconName="scale"
            status="Normal"
          />
          <HealthMetricCard
            title="Glucose"
            value={profile?.glucose || 'N/A'}
            unit="mg/dL"
            iconName="glucose"
            status="Normal"
          />
        </div>
      </div>

      {/* Medical Background & Emergency Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Allergies & Conditions" subtitle="Documented chronic factors" icon={Heart}>
          <div className="space-y-3 text-xs">
            <div>
              <span className="font-semibold text-slate-700 block mb-1">Known Allergies:</span>
              <div className="flex flex-wrap gap-1">
                {profile?.allergies?.length > 0 ? (
                  profile.allergies.map((a, idx) => (
                    <Badge key={idx} variant="danger" size="sm">
                      {a}
                    </Badge>
                  ))
                ) : (
                  <span className="text-slate-400">No known allergies</span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700 block mb-1">Chronic Medical Conditions:</span>
              <div className="flex flex-wrap gap-1">
                {profile?.conditions?.length > 0 ? (
                  profile.conditions.map((c, idx) => (
                    <Badge key={idx} variant="warning" size="sm">
                      {c}
                    </Badge>
                  ))
                ) : (
                  <span className="text-slate-400">None documented</span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700 block mb-1">Active Prescribed Medications:</span>
              <div className="flex flex-wrap gap-1">
                {profile?.medications?.length > 0 ? (
                  profile.medications.map((m, idx) => (
                    <Badge key={idx} variant="primary" size="sm">
                      {m}
                    </Badge>
                  ))
                ) : (
                  <span className="text-slate-400">None reported</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Emergency Contact" subtitle="Primary emergency designee" icon={User}>
          <div className="text-xs space-y-2 text-slate-700">
            <p>
              <span className="text-slate-400 block text-[11px]">Name:</span>
              <strong className="text-slate-900">{profile?.emergencyContact?.name || 'Not provided'}</strong>
            </p>
            <p>
              <span className="text-slate-400 block text-[11px]">Relationship:</span>
              <strong className="text-slate-900">{profile?.emergencyContact?.relationship || 'Not specified'}</strong>
            </p>
            <p>
              <span className="text-slate-400 block text-[11px]">Contact Phone:</span>
              <strong className="text-slate-900">{profile?.emergencyContact?.phone || 'Not provided'}</strong>
            </p>
          </div>
        </Card>

        {/* Future ML Prediction Readiness Container */}
        <PredictionPanel />
      </div>

      {/* Assessment History */}
      <Card
        title="Assessment History"
        subtitle="Patient submitted questionnaires and clinical review determinations"
        icon={ClipboardList}
      >
        {assessments.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No health assessments submitted yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 -mx-6">
            {assessments.map((ass) => (
              <div key={ass._id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{formatDate(ass.submittedAt)}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadgeClass(ass.status)}`}>
                      {ass.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Symptoms: {ass.symptoms?.length > 0 ? ass.symptoms.join(', ') : 'None'} • BP: {ass.vitals?.bloodPressure || 'N/A'} • HR: {ass.vitals?.heartRate || 'N/A'} bpm
                  </p>
                </div>
                <Button
                  variant="clinical"
                  size="sm"
                  icon={Stethoscope}
                  onClick={() => navigate(`/doctor/assessments/${ass._id}`)}
                >
                  Inspect & Review
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Medical Documents Archive */}
      <Card
        title="Patient Medical Records"
        subtitle="Archived laboratory tests, imaging reports, and summaries"
        icon={FolderHeart}
      >
        {records.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No archived documents for this patient.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {records.map((rec) => (
              <div key={rec._id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs flex justify-between items-start">
                <div>
                  <Badge variant="default" size="sm" className="mb-1">
                    {rec.type}
                  </Badge>
                  <h5 className="font-bold text-slate-900">{rec.title}</h5>
                  <p className="text-slate-500 text-[11px] mt-1">{rec.description}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">{formatDate(rec.recordDate)}</span>
                </div>
                <a
                  href={rec.fileUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Accessing encrypted document: ${rec.title}\nAuthorized clinical view.`);
                  }}
                  className="text-clinical-600 hover:text-clinical-700 p-1"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DoctorPatientDetailPage;
