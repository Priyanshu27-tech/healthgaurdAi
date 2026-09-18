import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Stethoscope,
  ClipboardList,
  Activity,
  Heart,
  Thermometer,
  Moon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
} from 'lucide-react';
import { doctorService } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DoctorReviewPanel from '../../components/common/DoctorReviewPanel';
import PredictionPanel from '../../components/common/PredictionPanel';
import { formatDate, formatDateTime, getStatusBadgeClass } from '../../utils/formatters';

export const DoctorReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);
  const [previousAssessments, setPreviousAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadAssessment = async () => {
    try {
      setLoading(true);
      const res = await doctorService.getAssessmentById(id);
      if (res.data.success) {
        setAssessment(res.data.assessment);
        setPatientProfile(res.data.patientProfile);
        setPreviousAssessments(res.data.previousAssessments || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Assessment not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessment();
  }, [id]);

  const handleSubmitReview = async ({ notes, status }) => {
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      const res = await doctorService.submitReview({
        assessmentId: id,
        notes,
        status,
      });
      if (res.data.success) {
        setSuccess('Clinical review successfully recorded and dispatched to patient.');
        await loadAssessment();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit clinical review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading patient assessment details..." />;
  }

  if (error || !assessment) {
    return (
      <div className="p-8 text-center">
        <p className="text-rose-600 font-semibold mb-4">{error || 'Assessment not found'}</p>
        <Link to="/doctor/assessments">
          <Button variant="secondary" icon={ArrowLeft}>
            Back to Review Queue
          </Button>
        </Link>
      </div>
    );
  }

  const patient = assessment.patientId;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <Link
            to="/doctor/assessments"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Clinical Assessment Review
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${getStatusBadgeClass(assessment.status)}`}>
                {assessment.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Submitted on {formatDate(assessment.submittedAt)} • Assessment ID: {assessment._id}
            </p>
          </div>
        </div>

        <Link to={`/doctor/patients/${patient?._id}`}>
          <Button variant="outline" size="sm">
            View Full Patient Chart
          </Button>
        </Link>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center shadow-soft-sm">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center shadow-soft-sm">
          <AlertCircle className="w-4 h-4 mr-2 text-rose-600 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Section 1: Patient Information */}
      <Card title="1. Patient Demographic Profile" subtitle="Identity and vital baseline" icon={User}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Full Name</span>
            <span className="font-bold text-slate-900">{patient?.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Gender</span>
            <span className="font-semibold text-slate-800">{patient?.gender || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Phone</span>
            <span className="font-semibold text-slate-800">{patient?.phone || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Email</span>
            <span className="font-semibold text-slate-800">{patient?.email}</span>
          </div>
        </div>
      </Card>

      {/* Section 2: Symptoms */}
      <Card title="2. Reported Symptoms" subtitle="Patient-selected acute and recurring symptoms" icon={ClipboardList}>
        <div className="flex flex-wrap gap-2">
          {assessment.symptoms?.length > 0 ? (
            assessment.symptoms.map((sym, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold"
              >
                {sym}
              </span>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No symptoms reported by patient.</p>
          )}
        </div>
      </Card>

      {/* Section 3: Vitals Snapshot */}
      <Card title="3. Physiological Vitals at Submission" subtitle="Objective measurements" icon={Activity}>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Blood Pressure</span>
            <span className="font-bold text-slate-900 text-sm">
              {assessment.vitals?.bloodPressure || 'N/A'}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Heart Rate</span>
            <span className="font-bold text-slate-900 text-sm">
              {assessment.vitals?.heartRate ? `${assessment.vitals.heartRate} bpm` : 'N/A'}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Temperature</span>
            <span className="font-bold text-slate-900 text-sm">
              {assessment.vitals?.temperature ? `${assessment.vitals.temperature} °F` : 'N/A'}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Weight</span>
            <span className="font-bold text-slate-900 text-sm">
              {assessment.vitals?.weight ? `${assessment.vitals.weight} kg` : 'N/A'}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Height</span>
            <span className="font-bold text-slate-900 text-sm">
              {assessment.vitals?.height ? `${assessment.vitals.height} cm` : 'N/A'}
            </span>
          </div>
        </div>
      </Card>

      {/* Section 4 & 5: Lifestyle and Medical History */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <Card title="4. Lifestyle Factors" subtitle="Behavioral habits" icon={Moon}>
          <div className="space-y-2 text-slate-700">
            <p><span className="text-slate-400">Smoking:</span> <strong>{assessment.lifestyle?.smoking || 'N/A'}</strong></p>
            <p><span className="text-slate-400">Alcohol:</span> <strong>{assessment.lifestyle?.alcohol || 'N/A'}</strong></p>
            <p><span className="text-slate-400">Activity:</span> <strong>{assessment.lifestyle?.physicalActivity || 'N/A'}</strong></p>
            <p><span className="text-slate-400">Sleep:</span> <strong>{assessment.lifestyle?.sleepDuration || 'N/A'}</strong></p>
            <p><span className="text-slate-400">Diet:</span> <strong>{assessment.lifestyle?.diet || 'N/A'}</strong></p>
          </div>
        </Card>

        <Card title="5. Medical History" subtitle="Underlying diagnoses" icon={ShieldCheck}>
          <div className="space-y-2 text-slate-700">
            <p><span className="text-slate-400">Diabetes:</span> <strong>{assessment.medicalHistory?.diabetes ? 'Positive' : 'None'}</strong></p>
            <p><span className="text-slate-400">Hypertension:</span> <strong>{assessment.medicalHistory?.hypertension ? 'Positive' : 'None'}</strong></p>
            <p><span className="text-slate-400">Heart Disease:</span> <strong>{assessment.medicalHistory?.heartDisease ? 'Positive' : 'None'}</strong></p>
            <p><span className="text-slate-400">Family History:</span> <strong>{assessment.medicalHistory?.familyHistory || 'None'}</strong></p>
            <p><span className="text-slate-400">Prior Surgeries:</span> <strong>{assessment.medicalHistory?.previousSurgeries || 'None'}</strong></p>
            {assessment.medicalHistory?.additionalNotes && (
              <p className="pt-2 text-slate-600 italic">"{assessment.medicalHistory.additionalNotes}"</p>
            )}
          </div>
        </Card>
      </div>

      {/* Future ML Prediction Panel Placeholder */}
      <PredictionPanel />

      {/* Doctor Review Interactive Submission Form */}
      <DoctorReviewPanel
        review={assessment.review}
        isDoctor={true}
        onSubmitReview={handleSubmitReview}
        isSubmitting={submitting}
      />
    </div>
  );
};

export default DoctorReviewPage;
