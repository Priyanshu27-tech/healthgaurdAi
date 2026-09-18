import React, { useState, useEffect } from 'react';
import { Stethoscope, User, Hospital, Award, Clock, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { doctorService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const DoctorProfilePage = () => {
  const { updateCachedProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    hospital: '',
    experience: '',
    bio: '',
    consultationHours: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await doctorService.getProfile();
        if (res.data.success) {
          const { user, profile } = res.data;
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            specialization: profile?.specialization || '',
            licenseNumber: profile?.licenseNumber || '',
            hospital: profile?.hospital || '',
            experience: profile?.experience || '',
            bio: profile?.bio || '',
            consultationHours: profile?.consultationHours || 'Mon - Fri: 09:00 AM - 05:00 PM',
          });
        }
      } catch (err) {
        setError('Unable to load doctor profile.');
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
      setError('');
      setSuccess('');
      const res = await doctorService.updateProfile(formData);
      if (res.data.success) {
        setSuccess('Doctor profile updated successfully.');
        updateCachedProfile(res.data.profile, res.data.user);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading doctor profile details..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Physician Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your public clinical credentials, practice affiliations, and consultation hours.
          </p>
        </div>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Physician Identity & Credentials" subtitle="Verified medical background" icon={Stethoscope}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name & Title"
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
              helperText="Managed by clinic administration"
            />
            <Input
              label="Medical Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
            <Input
              label="Medical License Number"
              name="licenseNumber"
              value={formData.licenseNumber}
              disabled
              helperText="Verified state medical licensure"
            />
            <Input
              label="Primary Hospital / Clinic"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              required
            />
            <Input
              label="Years in Practice"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleChange}
            />
            <Input
              label="Contact Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <Input
              label="Consultation Availability Hours"
              name="consultationHours"
              value={formData.consultationHours}
              onChange={handleChange}
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Professional Biography & Clinical Focus
            </label>
            <textarea
              rows={4}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Board certification, clinical interests, education, and patient care philosophy..."
              className="block w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-clinical-500"
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="clinical" size="lg" loading={saving} icon={Save}>
            Save Profile Credentials
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DoctorProfilePage;
