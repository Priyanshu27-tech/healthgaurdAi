import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/api';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError('Failed to process request. Please check email address.');
    } finally {
      setLoading(false);
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
          Account Recovery
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your registered email to receive password reset instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200/90 shadow-soft-lg">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Recovery Instructions Sent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an account with <span className="font-semibold text-slate-800">{email}</span> exists, we've dispatched a secure recovery link to your inbox.
              </p>
              <Link to="/login" className="block pt-2">
                <Button variant="secondary" size="md" icon={ArrowLeft} className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
              <Input
                label="Registered Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                Send Recovery Link
              </Button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
