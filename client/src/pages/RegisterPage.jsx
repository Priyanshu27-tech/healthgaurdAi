import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, Lock, Mail, User, Phone, Calendar, Hospital, Award, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState('patient'); // 'patient' | 'doctor'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    // Doctor fields
    specialization: '',
    licenseNumber: '',
    hospital: '',
    experience: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (role === 'doctor') {
      if (!formData.specialization || !formData.licenseNumber || !formData.hospital) {
        setError('Medical specialization, license number, and hospital affiliation are required.');
        return;
      }
    }

    try {
      setLoading(true);
      setError('');
      const payload = {
        ...formData,
        role,
      };
      const res = await register(payload);
      if (role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-health-700 to-clinical-500 text-white flex items-center justify-center shadow-soft">
            <HeartPulse className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">HealthGuard AI</span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Create Your Healthcare Account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Join our clinical network as an individual patient or certified healthcare practitioner
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200/90 shadow-soft-lg">
          {/* Role Selection Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                role === 'patient'
                  ? 'bg-white text-health-800 shadow-soft-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Patient Registration
            </button>
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                role === 'doctor'
                  ? 'bg-white text-clinical-800 shadow-soft-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Doctor / Physician Registration
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                placeholder={role === 'doctor' ? 'Dr. Jane Doe, MD' : 'Jane Doe'}
                icon={User}
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="jane@example.com"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                name="phone"
                placeholder="+1 (555) 000-0000"
                icon={Phone}
                value={formData.phone}
                onChange={handleChange}
              />

              {role === 'patient' ? (
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
              ) : (
                <Input
                  label="Years of Experience"
                  name="experience"
                  type="number"
                  placeholder="e.g. 10"
                  value={formData.experience}
                  onChange={handleChange}
                />
              )}
            </div>

            {role === 'patient' && (
              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                icon={Calendar}
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            )}

            {/* Doctor-Specific Professional Credentials */}
            {role === 'doctor' && (
              <div className="p-4 rounded-xl bg-clinical-50/50 border border-clinical-100 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-clinical-900 uppercase tracking-wider">
                  <Award className="w-4 h-4 text-clinical-600" />
                  <span>Clinical Licensure Credentials</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Medical Specialization"
                    name="specialization"
                    placeholder="e.g. Cardiology, Internal Medicine"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="License Number"
                    name="licenseNumber"
                    placeholder="e.g. MD-CA-993821"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  label="Hospital / Clinic Affiliation"
                  name="hospital"
                  placeholder="e.g. General Memorial Hospital"
                  icon={Hospital}
                  value={formData.hospital}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              variant={role === 'doctor' ? 'clinical' : 'primary'}
              size="lg"
              loading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              {role === 'doctor' ? 'Complete Doctor Registration' : 'Complete Patient Registration'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-health-600 hover:text-health-700">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
