import React from 'react';
import { Activity, ShieldCheck, HeartPulse, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-health-700 to-clinical-500 text-white flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900">HealthGuard AI</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Secure, digital healthcare platform connecting patients with certified medical professionals through streamlined health profiling and clinical review workflows.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Platform</h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="#features" className="hover:text-health-600 transition-colors">Digital Health Profiles</a></li>
              <li><a href="#how-it-works" className="hover:text-health-600 transition-colors">Health Assessments</a></li>
              <li><a href="#patients" className="hover:text-health-600 transition-colors">Patient Workstation</a></li>
              <li><a href="#doctors" className="hover:text-health-600 transition-colors">Clinical Doctor Portal</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Security & Compliance</h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-health-600" /> End-to-End Encryption</li>
              <li className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-health-600" /> Role-Based Access Control</li>
              <li className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-health-600" /> Verified Medical Licensure</li>
              <li className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-health-600" /> HIPAA-Ready Architecture</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Access Portal</h5>
            <div className="space-y-2 text-xs">
              <Link to="/login" className="block text-health-700 font-semibold hover:underline">
                Portal Sign In &rarr;
              </Link>
              <Link to="/register" className="block text-slate-600 hover:underline">
                Create New Patient or Doctor Account
              </Link>
              <p className="text-[11px] text-slate-400 mt-2">
                Demo credentials provided on the login page for development review.
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Disclaimer Notice */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed mb-6">
          <p className="font-semibold text-slate-700 mb-1 flex items-center">
            <Stethoscope className="w-3.5 h-3.5 mr-1.5 text-clinical-600" />
            Medical Disclaimer & Clinical Review Protocol:
          </p>
          HealthGuard AI provides structured health profile tracking, patient-doctor communication, and clinical review workflows. This release does not provide automated AI diagnostic predictions, computer-generated medical advice, or algorithmic treatment plans. All clinical evaluations, reviews, and diagnoses are conducted exclusively by licensed medical practitioners. In case of a medical emergency, immediately contact your local emergency services.
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-100 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} HealthGuard AI Healthcare Systems. All rights reserved.</p>
          <div className="flex space-x-6 mt-2 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Statement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
