import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HeartPulse, Lock, Mail, ArrowRight, UserCheck, Stethoscope, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState('');

  // Check if redirected from expired session
  const query = new URLSearchParams(location.search);
  const isExpired = query.get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await login(email, password);
      if (data.user?.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    try {
      setDemoLoading(role);
      setError('');
      const data = await demoLogin(role);
      if (data.user?.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Demo login failed.');
    } finally {
      setDemoLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-health-700 to-clinical-500 text-white flex items-center justify-center shadow-soft">
            <HeartPulse className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">HealthGuard AI</span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Sign In to Your Healthcare Portal
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Access your personalized health records or clinical triage workstation
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200/90 shadow-soft-lg">
          {isExpired && (
            <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              Your session has expired. Please sign in again.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Password <span className="text-rose-500">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-health-600 hover:text-health-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Sign In
            </Button>
          </form>

          {/* 1-Click Demo Evaluation Box */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center mb-3">
              1-Click Demo Logins for Evaluation
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('patient')}
                disabled={loading || !!demoLoading}
                className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg border border-health-200 bg-health-50/60 hover:bg-health-100 text-health-800 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {demoLoading === 'patient' ? (
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin mr-1" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5" />
                )}
                <span>Demo Patient</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('doctor')}
                disabled={loading || !!demoLoading}
                className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg border border-clinical-200 bg-clinical-50/60 hover:bg-clinical-100 text-clinical-800 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {demoLoading === 'doctor' ? (
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin mr-1" />
                ) : (
                  <Stethoscope className="w-3.5 h-3.5" />
                )}
                <span>Demo Doctor</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2 font-mono">
              patient@example.com / doctor@example.com
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-slate-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-health-600 hover:text-health-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
