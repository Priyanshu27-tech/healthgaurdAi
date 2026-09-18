import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  ClipboardList,
  Calendar,
  FolderHeart,
  ArrowRight,
  CheckCircle2,
  Lock,
  LineChart,
  UserCheck,
  Clock,
  Award,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-health-100 selection:text-health-900">
      <Navbar isPublic={true} />

      {/* Hero Section */}
      <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-health-100/60 via-clinical-50/40 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-health-50 border border-health-200 text-health-800 text-xs font-semibold mb-6 shadow-soft-sm">
              <span className="flex h-2 w-2 rounded-full bg-health-600 animate-pulse" />
              <span>Next-Gen Digital Healthcare Collaboration</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15] mb-6">
              Smarter Healthcare Starts With{' '}
              <span className="bg-gradient-to-r from-health-600 via-clinical-600 to-teal-700 bg-clip-text text-transparent">
                Better Decisions
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              HealthGuard connects patients and healthcare professionals through a secure digital healthcare platform, streamlining vital records, structured health assessments, and doctor review workflows.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
              <Link to="/register">
                <Button size="lg" icon={ArrowRight} className="w-full sm:w-auto shadow-soft-md">
                  Get Started Free
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Platform
                </Button>
              </a>
            </div>

            <div className="flex items-center justify-center space-x-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center">
                <ShieldCheck className="w-4 h-4 text-health-600 mr-1.5" />
                HIPAA-Ready Architecture
              </span>
              <span className="flex items-center">
                <UserCheck className="w-4 h-4 text-health-600 mr-1.5" />
                Certified Doctor Reviews
              </span>
              <span className="flex items-center">
                <Lock className="w-4 h-4 text-health-600 mr-1.5" />
                End-to-End Encryption
              </span>
            </div>
          </div>

          {/* Healthcare Dashboard Mockup Preview */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-soft-lg ring-1 ring-slate-900/5">
              <div className="rounded-xl overflow-hidden bg-slate-900 text-slate-100 p-4 sm:p-6">
                {/* Mock header bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-slate-400 font-mono text-[11px] ml-2">app.healthguard-ai.internal</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px]">
                    System Online
                  </span>
                </div>

                {/* Mock interior dashboard cards */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span>Blood Pressure</span>
                      <Activity className="w-4 h-4 text-rose-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">120 / 80 <span className="text-xs font-normal text-slate-400">mmHg</span></p>
                    <span className="inline-block mt-2 text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">Optimal</span>
                  </div>

                  <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span>Resting Heart Rate</span>
                      <HeartPulse className="w-4 h-4 text-rose-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">72 <span className="text-xs font-normal text-slate-400">BPM</span></p>
                    <span className="inline-block mt-2 text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">Normal Baseline</span>
                  </div>

                  <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span>Clinical Review Status</span>
                      <Stethoscope className="w-4 h-4 text-clinical-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">Verified</p>
                    <span className="inline-block mt-2 text-[11px] px-2 py-0.5 rounded bg-clinical-500/20 text-clinical-300 font-medium">Dr. Sarah Chen, MD</span>
                  </div>
                </div>

                {/* Workflow status snippet */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-health-400" />
                    <span>Upcoming Cardiology Consultation: Tomorrow at 10:00 AM</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">Room 302 • Dr. Chen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-health-700 mb-2">
              Comprehensive Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Complete Digital Healthcare Ecosystem
            </h3>
            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
              Designed for clinical accuracy, patient empowerment, and seamless collaboration between healthcare providers and patients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200/80 p-6 hover:shadow-soft-md transition-shadow bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-health-100 text-health-700 flex items-center justify-center mb-5">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Digital Health Profiles</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Centralize vital signs, BMI, blood pressure trends, known allergies, chronic conditions, and emergency contacts in one secure profile.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200/80 p-6 hover:shadow-soft-md transition-shadow bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-clinical-100 text-clinical-700 flex items-center justify-center mb-5">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Health Assessments</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete structured questionnaires covering multi-system symptoms, lifestyle factors, vitals, and surgical history without automated diagnostic bias.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200/80 p-6 hover:shadow-soft-md transition-shadow bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <FolderHeart className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Medical Records</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Organize lab reports, prescriptions, imaging scans, and clinical notes with timestamped metadata and doctor access permissions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-200/80 p-6 hover:shadow-soft-md transition-shadow bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Doctor Review Workflows</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Licensed physicians inspect complete patient assessments, document clinical observations, and determine follow-up care pathways.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-slate-200/80 p-6 hover:shadow-soft-md transition-shadow bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Appointment Management</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Schedule in-person or virtual consultations with verified specialists, manage appointment statuses, and track visit notes.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-slate-200/80 p-6 hover:shadow-soft-md transition-shadow bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-5">
                <LineChart className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Health History & Trends</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive charts illustrate physiological changes over time, helping both patients and clinicians monitor therapeutic response.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-health-700 mb-2">
              Simple & Transparent
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How HealthGuard Works
            </h3>
            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
              Four structured steps connecting your personal health baseline to expert clinical oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 relative shadow-soft">
              <span className="w-8 h-8 rounded-full bg-health-600 text-white font-bold text-xs flex items-center justify-center mb-4">
                1
              </span>
              <h4 className="text-base font-bold text-slate-900 mb-2">Create Your Profile</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Register as a patient, record your vital parameters, existing conditions, medications, and emergency contact.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 relative shadow-soft">
              <span className="w-8 h-8 rounded-full bg-health-600 text-white font-bold text-xs flex items-center justify-center mb-4">
                2
              </span>
              <h4 className="text-base font-bold text-slate-900 mb-2">Complete Health Assessment</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log your latest symptoms, vitals snapshot, lifestyle habits, and medical history with multi-select checkboxes.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 relative shadow-soft">
              <span className="w-8 h-8 rounded-full bg-health-600 text-white font-bold text-xs flex items-center justify-center mb-4">
                3
              </span>
              <h4 className="text-base font-bold text-slate-900 mb-2">Review Health Information</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect your submitted assessment timeline, securely catalog lab documents, and track physiological trends.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 relative shadow-soft">
              <span className="w-8 h-8 rounded-full bg-health-600 text-white font-bold text-xs flex items-center justify-center mb-4">
                4
              </span>
              <h4 className="text-base font-bold text-slate-900 mb-2">Connect With Your Doctor</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your attending physician reviews your assessment, writes clinical guidance, and schedules consultations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Patients & For Doctors Split Showcase */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* For Patients */}
          <div id="patients" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-health-50 text-health-700 text-xs font-semibold mb-3">
                <HeartPulse className="w-4 h-4" />
                <span>Patient Experience</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                Take Command of Your Personal Health Journey
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                HealthGuard empowers patients with an organized, intuitive dashboard to log assessments, track vital statistics over time, securely archive lab reports, and stay connected with their doctors.
              </p>

              <ul className="space-y-3 text-xs text-slate-700 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-health-600 mr-2 flex-shrink-0" />
                  Effortless health assessment submission without confusing algorithmic jargon.
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-health-600 mr-2 flex-shrink-0" />
                  Real-time notifications when your doctor completes a clinical assessment review.
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-health-600 mr-2 flex-shrink-0" />
                  One-click appointment booking with licensed clinic practitioners.
                </li>
              </ul>

              <Link to="/register">
                <Button size="md" icon={ArrowRight}>
                  Join as a Patient
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-health-50 via-clinical-50 to-white rounded-2xl p-8 border border-health-200/70 shadow-soft">
              <div className="bg-white rounded-xl p-5 shadow-soft border border-slate-100 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-health-100 text-health-700 flex items-center justify-center font-bold text-xs">
                      AW
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Alexander Wright</p>
                      <p className="text-[11px] text-slate-500">Patient • Age 38</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Profile 95% Complete
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50">
                    <span className="text-[11px] text-slate-500 block">Blood Pressure</span>
                    <span className="font-bold text-slate-900">122 / 80 mmHg</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50">
                    <span className="text-[11px] text-slate-500 block">BMI</span>
                    <span className="font-bold text-slate-900">24.0 (Normal)</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-health-50/70 border border-health-100 text-xs text-health-900">
                  <p className="font-semibold">Recent Clinical Review:</p>
                  <p className="text-[11px] text-health-800 mt-1">
                    "Vitals optimal. Recommended screen hygiene rule and consistent hydration." — Dr. Chen
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* For Doctors */}
          <div id="doctors" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-8">
            <div className="order-2 lg:order-1 bg-gradient-to-br from-clinical-50 via-slate-50 to-white rounded-2xl p-8 border border-clinical-200/70 shadow-soft">
              <div className="bg-white rounded-xl p-5 shadow-soft border border-slate-100 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-clinical-100 text-clinical-700 flex items-center justify-center font-bold text-xs">
                      SC
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Dr. Sarah Chen, MD</p>
                      <p className="text-[11px] text-slate-500">Cardiology & Internal Medicine</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-clinical-50 text-clinical-700 border border-clinical-200">
                    4 Pending Reviews
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">David Miller (Age 60)</p>
                      <p className="text-[11px] text-slate-500">Hypertension • Dyspnea</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                      Follow-up Needed
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">Sophia Rodriguez (Age 31)</p>
                      <p className="text-[11px] text-slate-500">Headache • Dizziness</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                      Pending Review
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-clinical-50 text-clinical-700 text-xs font-semibold mb-3">
                <Stethoscope className="w-4 h-4" />
                <span>Doctor Workstation</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                Streamlined Clinical Review & Patient Oversight
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Physicians gain a purpose-built workspace to triage pending patient assessments, examine complete medical charts, document clinical guidance, and manage consultation schedules efficiently.
              </p>

              <ul className="space-y-3 text-xs text-slate-700 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-clinical-600 mr-2 flex-shrink-0" />
                  Prioritized triage queue highlighting patients needing immediate clinical follow-up.
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-clinical-600 mr-2 flex-shrink-0" />
                  Unified access to patient longitudinal records, vitals, and surgical history.
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-clinical-600 mr-2 flex-shrink-0" />
                  Structured doctor review notes seamlessly synced to the patient portal.
                </li>
              </ul>

              <Link to="/register">
                <Button variant="clinical" size="md" icon={ArrowRight}>
                  Register as a Physician
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-health-700 mb-2">
            Our Architectural Vision
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
            Engineered For Clinical Integrity & Future Intelligence
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-8">
            HealthGuard AI is purposefully designed to separate clinical fact from future algorithmic inference. While the platform currently operates with 100% certified human medical oversight, its underlying microservice contract is pre-architected to seamlessly ingest future machine learning prediction pipelines without disruption.
          </p>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft text-left grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <h5 className="font-bold text-slate-900 mb-1 flex items-center">
                <Award className="w-4 h-4 text-health-600 mr-1.5" />
                Human-Centered Healthcare
              </h5>
              <p className="text-slate-500 leading-relaxed">
                We believe healthcare decisions must always be made by qualified doctors in partnership with informed patients.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-1 flex items-center">
                <Lock className="w-4 h-4 text-health-600 mr-1.5" />
                Strict Data Governance
              </h5>
              <p className="text-slate-500 leading-relaxed">
                Role-based access boundaries guarantee that sensitive medical profiles are restricted strictly to authorized stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
