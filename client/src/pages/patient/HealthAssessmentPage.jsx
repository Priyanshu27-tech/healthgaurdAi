import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Activity,
  Heart,
  Thermometer,
  Moon,
  Wine,
  Cigarette,
  Flame,
  Send,
  ArrowLeft,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { assessmentService, patientService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const HealthAssessmentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [createdAssessmentId, setCreatedAssessmentId] = useState(null);

  // Form State
  const [vitals, setVitals] = useState({
    height: '',
    weight: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '98.6',
  });

  const [lifestyle, setLifestyle] = useState({
    smoking: 'Never',
    alcohol: 'None',
    physicalActivity: 'Moderate',
    sleepDuration: '7-8 hours',
    diet: 'Balanced',
  });

  const [symptoms, setSymptoms] = useState([]);

  const [medicalHistory, setMedicalHistory] = useState({
    diabetes: false,
    hypertension: false,
    heartDisease: false,
    familyHistory: '',
    previousSurgeries: '',
    additionalNotes: '',
  });

  // Prepopulate vitals from profile if available
  useEffect(() => {
    const fetchProfileDefaults = async () => {
      try {
        const res = await patientService.getProfile();
        if (res.data.success && res.data.profile) {
          const p = res.data.profile;
          setVitals((prev) => ({
            ...prev,
            height: p.height || '',
            weight: p.weight || '',
            bloodPressure: p.bloodPressure || '',
            heartRate: p.heartRate || '',
          }));
        }
      } catch (err) {
        // silently fallback to empty
      }
    };
    fetchProfileDefaults();
  }, []);

  const symptomOptions = [
    { id: 'fever', label: 'Fever / Chills' },
    { id: 'fatigue', label: 'Unusual Fatigue' },
    { id: 'cough', label: 'Persistent Cough' },
    { id: 'headache', label: 'Headache' },
    { id: 'chest_discomfort', label: 'Chest Discomfort / Tightness' },
    { id: 'shortness_of_breath', label: 'Shortness of Breath' },
    { id: 'nausea', label: 'Nausea or Vomiting' },
    { id: 'dizziness', label: 'Dizziness / Lightheadedness' },
    { id: 'sore_throat', label: 'Sore Throat' },
    { id: 'body_aches', label: 'Muscle or Body Aches' },
    { id: 'palpitations', label: 'Heart Palpitations' },
    { id: 'joint_pain', label: 'Joint Pain or Stiffness' },
  ];

  const toggleSymptom = (label) => {
    setSymptoms((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const payload = {
        vitals: {
          height: vitals.height ? Number(vitals.height) : 0,
          weight: vitals.weight ? Number(vitals.weight) : 0,
          bloodPressure: vitals.bloodPressure,
          heartRate: vitals.heartRate ? Number(vitals.heartRate) : 0,
          temperature: vitals.temperature ? Number(vitals.temperature) : 98.6,
        },
        lifestyle,
        symptoms,
        medicalHistory,
      };

      const res = await assessmentService.submit(payload);
      if (res.data.success) {
        setCreatedAssessmentId(res.data.assessmentId);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Assessment could not be submitted. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  // Submission Confirmation View (Neutral, strictly zero fake ML prediction or diagnosis)
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft-lg p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-soft">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Record Secured
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-3">Assessment Submitted</h2>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              Your health information has been securely recorded and is available for review by your attending physician.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-500">Submission Identifier:</span>
              <span className="font-mono font-semibold text-slate-800">{createdAssessmentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Clinical Queue Status:</span>
              <span className="font-semibold text-amber-700">Awaiting Doctor Review</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Reported Symptoms:</span>
              <span className="font-medium text-slate-800">{symptoms.length > 0 ? symptoms.join(', ') : 'None reported'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/patient/assessments">
              <Button variant="primary" size="md">
                View in Assessment History
              </Button>
            </Link>
            <Link to="/patient/dashboard">
              <Button variant="secondary" size="md">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 pb-2 border-b border-slate-200">
        <Link to="/patient/dashboard" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Health Assessment</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log your current physiological state and symptoms for doctor clinical review.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center shadow-soft-sm">
          <AlertCircle className="w-4 h-4 mr-2 text-rose-600 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Vitals */}
        <Card title="1. Current Vitals Snapshot" subtitle="Key physiological measurements" icon={Activity}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Blood Pressure (mmHg)"
              name="bloodPressure"
              placeholder="e.g. 120/80"
              value={vitals.bloodPressure}
              onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
            />
            <Input
              label="Heart Rate (bpm)"
              name="heartRate"
              type="number"
              placeholder="e.g. 72"
              value={vitals.heartRate}
              onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
            />
            <Input
              label="Body Temperature (°F)"
              name="temperature"
              type="number"
              step="0.1"
              placeholder="98.6"
              value={vitals.temperature}
              onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
            />
            <Input
              label="Height (cm)"
              name="height"
              type="number"
              placeholder="178"
              value={vitals.height}
              onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
            />
            <Input
              label="Weight (kg)"
              name="weight"
              type="number"
              placeholder="75"
              value={vitals.weight}
              onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
            />
          </div>
        </Card>

        {/* Step 2: Multi-select Symptoms Interface */}
        <Card title="2. Symptoms Checklist" subtitle="Select all symptoms you are currently experiencing" icon={ClipboardList}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {symptomOptions.map((item) => {
              const isChecked = symptoms.includes(item.label);
              return (
                <label
                  key={item.id}
                  className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-health-50/70 border-health-300 text-health-950 font-semibold shadow-soft-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSymptom(item.label)}
                    className="w-4 h-4 rounded border-slate-300 text-health-600 focus:ring-health-500"
                  />
                  <span className="text-xs">{item.label}</span>
                </label>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 mt-3">
            Selected {symptoms.length} symptom{symptoms.length === 1 ? '' : 's'}. Leave unchecked if asymptomatic.
          </p>
        </Card>

        {/* Step 3: Lifestyle Factors */}
        <Card title="3. Lifestyle Factors" subtitle="Daily habits influencing clinical wellness" icon={Moon}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Smoking Status"
              name="smoking"
              value={lifestyle.smoking}
              onChange={(e) => setLifestyle({ ...lifestyle, smoking: e.target.value })}
              options={['Never', 'Former', 'Current Occasional', 'Current Regular', 'Not Disclosed']}
            />

            <Select
              label="Alcohol Consumption"
              name="alcohol"
              value={lifestyle.alcohol}
              onChange={(e) => setLifestyle({ ...lifestyle, alcohol: e.target.value })}
              options={['None', 'Occasional', 'Moderate', 'Frequent', 'Not Disclosed']}
            />

            <Select
              label="Physical Activity Level"
              name="physicalActivity"
              value={lifestyle.physicalActivity}
              onChange={(e) => setLifestyle({ ...lifestyle, physicalActivity: e.target.value })}
              options={['Sedentary', 'Light', 'Moderate', 'Very Active']}
            />

            <Select
              label="Average Sleep Duration"
              name="sleepDuration"
              value={lifestyle.sleepDuration}
              onChange={(e) => setLifestyle({ ...lifestyle, sleepDuration: e.target.value })}
              options={['< 5 hours', '5-6 hours', '7-8 hours', '8+ hours']}
            />

            <Select
              label="Dietary Pattern"
              name="diet"
              value={lifestyle.diet}
              onChange={(e) => setLifestyle({ ...lifestyle, diet: e.target.value })}
              options={['Balanced', 'Vegetarian', 'Vegan', 'Low Carb', 'High Sodium / Processed', 'Other']}
            />
          </div>
        </Card>

        {/* Step 4: Medical History */}
        <Card title="4. Medical History & Context" subtitle="Known clinical conditions and context" icon={ShieldCheck}>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={medicalHistory.diabetes}
                  onChange={(e) => setMedicalHistory({ ...medicalHistory, diabetes: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-health-600 focus:ring-health-500"
                />
                <span>History of Diabetes</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={medicalHistory.hypertension}
                  onChange={(e) => setMedicalHistory({ ...medicalHistory, hypertension: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-health-600 focus:ring-health-500"
                />
                <span>History of Hypertension</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={medicalHistory.heartDisease}
                  onChange={(e) => setMedicalHistory({ ...medicalHistory, heartDisease: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-health-600 focus:ring-health-500"
                />
                <span>History of Cardiovascular Disease</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="Family Medical History"
                name="familyHistory"
                placeholder="e.g. Maternal history of diabetes"
                value={medicalHistory.familyHistory}
                onChange={(e) => setMedicalHistory({ ...medicalHistory, familyHistory: e.target.value })}
              />

              <Input
                label="Previous Surgeries"
                name="previousSurgeries"
                placeholder="e.g. Appendectomy 2012"
                value={medicalHistory.previousSurgeries}
                onChange={(e) => setMedicalHistory({ ...medicalHistory, previousSurgeries: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Additional Observations / Notes for Doctor
              </label>
              <textarea
                rows={2}
                value={medicalHistory.additionalNotes}
                onChange={(e) => setMedicalHistory({ ...medicalHistory, additionalNotes: e.target.value })}
                placeholder="Any context regarding symptom duration, triggers, or specific concerns..."
                className="block w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-health-500"
              />
            </div>
          </div>
        </Card>

        {/* Submit Action */}
        <div className="p-4 rounded-xl bg-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Your assessment will be routed to your attending doctor's triage queue for clinical evaluation.
          </p>
          <Button type="submit" variant="primary" size="lg" loading={loading} icon={Send}>
            Submit Assessment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HealthAssessmentPage;
