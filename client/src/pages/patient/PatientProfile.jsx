import React, { useState, useEffect } from 'react';
import { User, Heart, Phone, ShieldAlert, CheckCircle2, Save, AlertCircle } from 'lucide-react';
import { patientService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const PatientProfile = () => {
  const { updateCachedProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    // Health Info
    height: '',
    weight: '',
    bloodPressure: '',
    heartRate: '',
    glucose: '',
    allergies: '',
    conditions: '',
    medications: '',
    // Emergency Contact
    emergencyName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await patientService.getProfile();
        if (res.data.success) {
          const { user, profile } = res.data;
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
            gender: user.gender || '',
            height: profile?.height || '',
            weight: profile?.weight || '',
            bloodPressure: profile?.bloodPressure || '',
            heartRate: profile?.heartRate || '',
            glucose: profile?.glucose || '',
            allergies: Array.isArray(profile?.allergies) ? profile.allergies.join(', ') : '',
            conditions: Array.isArray(profile?.conditions) ? profile.conditions.join(', ') : '',
            medications: Array.isArray(profile?.medications) ? profile.medications.join(', ') : '',
            emergencyName: profile?.emergencyContact?.name || '',
            emergencyRelationship: profile?.emergencyContact?.relationship || '',
            emergencyPhone: profile?.emergencyContact?.phone || '',
          });
        }
      } catch (err) {
        setErrorMsg('Unable to load your health profile. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');
      setSuccessMsg('');

      const payload = {
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth || null,
        height: formData.height ? Number(formData.height) : 0,
        weight: formData.weight ? Number(formData.weight) : 0,
        bloodPressure: formData.bloodPressure,
        heartRate: formData.heartRate ? Number(formData.heartRate) : 0,
        glucose: formData.glucose ? Number(formData.glucose) : 0,
        allergies: formData.allergies,
        conditions: formData.conditions,
        medications: formData.medications,
        emergencyContact: {
          name: formData.emergencyName,
          relationship: formData.emergencyRelationship,
          phone: formData.emergencyPhone,
        },
      };

      const res = await patientService.updateProfile(payload);
      if (res.data.success) {
        setSuccessMsg('Health profile updated successfully.');
        updateCachedProfile(res.data.profile, res.data.user);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update health profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading health profile..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Personal Health Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain your longitudinal health metrics, medical conditions, and clinical baseline data.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center shadow-soft-sm">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center shadow-soft-sm">
          <AlertCircle className="w-4 h-4 mr-2 text-rose-600 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal Information */}
        <Card title="Personal Information" subtitle="Demographic baseline" icon={User}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              disabled
              helperText="Email cannot be changed directly"
            />
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
            />
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={[
                { value: 'Female', label: 'Female' },
                { value: 'Male', label: 'Male' },
                { value: 'Other', label: 'Other' },
                { value: 'Prefer not to say', label: 'Prefer not to say' },
              ]}
            />
          </div>
        </Card>

        {/* Section 2: Clinical Vitals & Health Information */}
        <Card title="Health Information & Vitals" subtitle="Physiological baseline parameters" icon={Heart}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Input
              label="Height (cm)"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
              placeholder="e.g. 178"
            />
            <Input
              label="Weight (kg)"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g. 75"
            />
            <Input
              label="Blood Pressure (mmHg)"
              name="bloodPressure"
              value={formData.bloodPressure}
              onChange={handleChange}
              placeholder="e.g. 120/80"
            />
            <Input
              label="Resting Heart Rate (bpm)"
              name="heartRate"
              type="number"
              value={formData.heartRate}
              onChange={handleChange}
              placeholder="e.g. 72"
            />
            <Input
              label="Fasting Glucose (mg/dL)"
              name="glucose"
              type="number"
              value={formData.glucose}
              onChange={handleChange}
              placeholder="e.g. 95"
            />
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-100">
            <Input
              label="Known Allergies (Comma-separated)"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="e.g. Penicillin, Peanuts, Sulfa"
            />
            <Input
              label="Chronic / Existing Medical Conditions (Comma-separated)"
              name="conditions"
              value={formData.conditions}
              onChange={handleChange}
              placeholder="e.g. Hypertension, Asthma"
            />
            <Input
              label="Current Medications (Comma-separated)"
              name="medications"
              value={formData.medications}
              onChange={handleChange}
              placeholder="e.g. Lisinopril 10mg daily, Albuterol Inhaler"
            />
          </div>
        </Card>

        {/* Section 3: Emergency Contact */}
        <Card title="Emergency Contact" subtitle="Designated primary contact person" icon={Phone}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Contact Name"
              name="emergencyName"
              value={formData.emergencyName}
              onChange={handleChange}
              placeholder="e.g. Elena Wright"
            />
            <Input
              label="Relationship"
              name="emergencyRelationship"
              value={formData.emergencyRelationship}
              onChange={handleChange}
              placeholder="e.g. Spouse, Parent, Sibling"
            />
            <Input
              label="Emergency Phone"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              placeholder="+1 (555) 998-1122"
            />
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="lg" loading={saving} icon={Save}>
            Save Health Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PatientProfile;
