require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const PatientProfile = require('../models/PatientProfile');
const Assessment = require('../models/Assessment');
const DoctorReview = require('../models/DoctorReview');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    console.log('[Seeder] Cleaning existing development records...');
    await Promise.all([
      User.deleteMany({}),
      DoctorProfile.deleteMany({}),
      PatientProfile.deleteMany({}),
      Assessment.deleteMany({}),
      DoctorReview.deleteMany({}),
      Appointment.deleteMany({}),
      MedicalRecord.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('[Seeder] Seeding Demo Doctors...');
    // Doctor 1 (Primary Demo)
    const doc1 = await User.create({
      name: 'Dr. Sarah Chen, MD',
      email: 'doctor@example.com',
      password: 'Password123!',
      role: 'doctor',
      phone: '+1 (555) 234-5678',
      gender: 'Female',
    });

    const doc1Profile = await DoctorProfile.create({
      userId: doc1._id,
      specialization: 'Cardiology & Preventive Medicine',
      licenseNumber: 'MD-CA-884920',
      hospital: 'Metro Health Academic Medical Center',
      experience: 14,
      bio: 'Board-certified cardiologist specializing in preventive cardiovascular wellness, hypertension management, and digital health diagnostics.',
      consultationHours: 'Mon - Thu: 09:00 AM - 04:30 PM',
    });

    // Doctor 2
    const doc2 = await User.create({
      name: 'Dr. Marcus Vance, MD',
      email: 'marcus.vance@example.com',
      password: 'Password123!',
      role: 'doctor',
      phone: '+1 (555) 345-6789',
      gender: 'Male',
    });

    await DoctorProfile.create({
      userId: doc2._id,
      specialization: 'Internal Medicine',
      licenseNumber: 'MD-NY-772911',
      hospital: 'Saint Jude Memorial Hospital',
      experience: 9,
      bio: 'Internal medicine specialist dedicated to chronic disease management, metabolic health, and personalized patient care plans.',
      consultationHours: 'Tue - Fri: 08:30 AM - 04:00 PM',
    });

    console.log('[Seeder] Seeding Demo Patients...');
    // Patient 1 (Primary Demo)
    const pat1 = await User.create({
      name: 'Alexander Wright',
      email: 'patient@example.com',
      password: 'Password123!',
      role: 'patient',
      phone: '+1 (555) 876-5432',
      dateOfBirth: new Date('1988-04-14'),
      gender: 'Male',
    });

    const pat1Profile = await PatientProfile.create({
      userId: pat1._id,
      height: 178, // cm
      weight: 76,  // kg
      bloodPressure: '122/80',
      heartRate: 72,
      glucose: 94,
      allergies: ['Penicillin', 'Peanuts'],
      conditions: ['Mild Seasonal Asthma'],
      medications: ['Albuterol Inhaler (PRN)'],
      emergencyContact: {
        name: 'Elena Wright',
        relationship: 'Spouse',
        phone: '+1 (555) 998-1122',
      },
    });

    // Patient 2
    const pat2 = await User.create({
      name: 'Sophia Rodriguez',
      email: 'sophia.rodriguez@example.com',
      password: 'Password123!',
      role: 'patient',
      phone: '+1 (555) 654-3210',
      dateOfBirth: new Date('1994-09-22'),
      gender: 'Female',
    });

    await PatientProfile.create({
      userId: pat2._id,
      height: 165,
      weight: 62,
      bloodPressure: '118/76',
      heartRate: 68,
      glucose: 88,
      allergies: ['Sulfa drugs'],
      conditions: ['Migraine'],
      medications: ['Sumatriptan 50mg'],
      emergencyContact: {
        name: 'Carlos Rodriguez',
        relationship: 'Brother',
        phone: '+1 (555) 443-8899',
      },
    });

    // Patient 3
    const pat3 = await User.create({
      name: 'David Miller',
      email: 'david.miller@example.com',
      password: 'Password123!',
      role: 'patient',
      phone: '+1 (555) 432-1098',
      dateOfBirth: new Date('1965-11-05'),
      gender: 'Male',
    });

    await PatientProfile.create({
      userId: pat3._id,
      height: 182,
      weight: 89,
      bloodPressure: '136/88',
      heartRate: 78,
      glucose: 112,
      allergies: ['None known'],
      conditions: ['Essential Hypertension', 'Borderline Hyperlipidemia'],
      medications: ['Lisinopril 10mg daily', 'Atorvastatin 20mg'],
      emergencyContact: {
        name: 'Margaret Miller',
        relationship: 'Spouse',
        phone: '+1 (555) 777-6655',
      },
    });

    console.log('[Seeder] Seeding Health Assessments...');
    // Assessment 1: Alexander Wright - Reviewed
    const ass1 = await Assessment.create({
      patientId: pat1._id,
      symptoms: ['Mild Fatigue', 'Occasional Headache'],
      vitals: {
        height: 178,
        weight: 76,
        bloodPressure: '122/80',
        heartRate: 72,
        temperature: 98.4,
      },
      lifestyle: {
        smoking: 'Never',
        alcohol: 'Occasional',
        physicalActivity: 'Moderate',
        sleepDuration: '7 hours',
        diet: 'Balanced',
      },
      medicalHistory: {
        diabetes: false,
        hypertension: false,
        heartDisease: false,
        familyHistory: 'Maternal grandfather had type 2 diabetes',
        previousSurgeries: 'Appendectomy (2012)',
        additionalNotes: 'Working long hours in screen-intensive job',
      },
      status: 'reviewed',
      submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    });

    // Clinical Review for Assessment 1 by Dr. Sarah Chen
    await DoctorReview.create({
      assessmentId: ass1._id,
      patientId: pat1._id,
      doctorId: doc1._id,
      notes: 'Vitals are well within optimal clinical baseline. Fatigue and mild headache are consistent with occupational digital strain and mild sleep restriction. Recommended 20-20-20 screen hygiene rule, consistent hydration (2.5L/day), and scheduled follow-up if symptoms persist beyond 2 weeks.',
      status: 'reviewed',
      reviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    });

    // Assessment 2: Alexander Wright - Recent Pending Review
    const ass2 = await Assessment.create({
      patientId: pat1._id,
      symptoms: ['Mild Cough', 'Chest discomfort'],
      vitals: {
        height: 178,
        weight: 75.8,
        bloodPressure: '124/82',
        heartRate: 74,
        temperature: 98.7,
      },
      lifestyle: {
        smoking: 'Never',
        alcohol: 'None',
        physicalActivity: 'Light',
        sleepDuration: '6.5 hours',
        diet: 'Balanced',
      },
      medicalHistory: {
        diabetes: false,
        hypertension: false,
        heartDisease: false,
        familyHistory: 'Maternal grandfather diabetes',
        previousSurgeries: 'Appendectomy (2012)',
        additionalNotes: 'Cough onset after viral cold 4 days ago',
      },
      status: 'pending',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    // Assessment 3: Sophia Rodriguez - Pending Review
    await Assessment.create({
      patientId: pat2._id,
      symptoms: ['Headache', 'Dizziness', 'Fatigue'],
      vitals: {
        height: 165,
        weight: 62,
        bloodPressure: '118/76',
        heartRate: 70,
        temperature: 98.6,
      },
      lifestyle: {
        smoking: 'Never',
        alcohol: 'None',
        physicalActivity: 'Moderate',
        sleepDuration: '6 hours',
        diet: 'Vegetarian',
      },
      medicalHistory: {
        diabetes: false,
        hypertension: false,
        heartDisease: false,
        familyHistory: 'Maternal migraines',
        previousSurgeries: 'None',
        additionalNotes: 'Migraine episode triggered by travel and dehydration',
      },
      status: 'pending',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // Assessment 4: David Miller - Reviewed with Follow-up
    const ass4 = await Assessment.create({
      patientId: pat3._id,
      symptoms: ['Shortness of breath', 'Fatigue'],
      vitals: {
        height: 182,
        weight: 89.5,
        bloodPressure: '138/90',
        heartRate: 82,
        temperature: 98.6,
      },
      lifestyle: {
        smoking: 'Former',
        alcohol: 'Occasional',
        physicalActivity: 'Light',
        sleepDuration: '6 hours',
        diet: 'High Sodium / Processed',
      },
      medicalHistory: {
        diabetes: false,
        hypertension: true,
        heartDisease: false,
        familyHistory: 'Paternal coronary artery disease at age 62',
        previousSurgeries: 'Knee arthroscopy (2018)',
        additionalNotes: 'Exertional dyspnea when climbing two flights of stairs',
      },
      status: 'requires_followup',
      submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    });

    await DoctorReview.create({
      assessmentId: ass4._id,
      patientId: pat3._id,
      doctorId: doc1._id,
      notes: 'Blood pressure elevated at 138/90 mmHg. In combination with exertional dyspnea and family history of CAD, requires in-person cardiology evaluation, resting ECG, and repeat lipid profile. Patient notified to schedule clinic visit.',
      status: 'requires_followup',
      reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    // Assessment 5: David Miller - Older baseline
    await Assessment.create({
      patientId: pat3._id,
      symptoms: ['Fatigue'],
      vitals: {
        height: 182,
        weight: 91,
        bloodPressure: '134/86',
        heartRate: 76,
        temperature: 98.5,
      },
      lifestyle: {
        smoking: 'Former',
        alcohol: 'Occasional',
        physicalActivity: 'Light',
        sleepDuration: '6.5 hours',
        diet: 'High Sodium / Processed',
      },
      medicalHistory: {
        diabetes: false,
        hypertension: true,
        heartDisease: false,
        familyHistory: 'Paternal CAD',
        previousSurgeries: 'Knee arthroscopy',
        additionalNotes: 'Routine quarterly check',
      },
      status: 'reviewed',
      submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    });

    console.log('[Seeder] Seeding Appointments...');
    // Tomorrow appointment for Alexander Wright
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    await Appointment.create({
      patientId: pat1._id,
      doctorId: doc1._id,
      date: tomorrowStr,
      time: '10:00 AM',
      reason: 'Follow-up consultation on mild respiratory symptoms and vital check',
      status: 'Scheduled',
      notes: 'In-clinic consultation, Cardiology Department, Room 302',
    });

    // Next week appointment for David Miller
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 5);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    await Appointment.create({
      patientId: pat3._id,
      doctorId: doc1._id,
      date: nextWeekStr,
      time: '02:30 PM',
      reason: 'Hypertension evaluation and ECG review',
      status: 'Scheduled',
      notes: 'Bring current medication list and morning blood pressure log',
    });

    // Past completed appointment for Alexander Wright
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 14);
    const pastDateStr = pastDate.toISOString().split('T')[0];

    await Appointment.create({
      patientId: pat1._id,
      doctorId: doc2._id,
      date: pastDateStr,
      time: '11:15 AM',
      reason: 'Annual preventive physical examination',
      status: 'Completed',
      notes: 'Annual physical completed. All parameters stable.',
    });

    console.log('[Seeder] Seeding Medical Records...');
    await MedicalRecord.create({
      patientId: pat1._id,
      uploadedBy: doc1._id,
      title: 'Comprehensive Metabolic Panel & Lipid Profile',
      type: 'Lab Report',
      fileUrl: 'https://healthguard-ai-docs.local/records/cmp_lipid_2026.pdf',
      description: 'Total Cholesterol: 182 mg/dL, HDL: 54 mg/dL, LDL: 108 mg/dL, Triglycerides: 100 mg/dL, Fasting Glucose: 92 mg/dL. Normal limits.',
      recordDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    });

    await MedicalRecord.create({
      patientId: pat1._id,
      uploadedBy: doc2._id,
      title: 'Annual Preventive Health Clinical Summary',
      type: 'Doctor Note',
      fileUrl: 'https://healthguard-ai-docs.local/records/annual_preventive_2026.pdf',
      description: 'Physical examination unremarkable. Clear lungs bilaterally, S1/S2 normal without murmurs. Immunizations up to date.',
      recordDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    });

    await MedicalRecord.create({
      patientId: pat3._id,
      uploadedBy: doc1._id,
      title: '12-Lead Resting Electrocardiogram (ECG)',
      type: 'Imaging',
      fileUrl: 'https://healthguard-ai-docs.local/records/ecg_miller_2026.pdf',
      description: 'Normal sinus rhythm at 74 bpm. Borderline voltage criteria for left ventricular hypertrophy. No acute ischemic ST-T changes.',
      recordDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    console.log('[Seeder] Seeding Notifications...');
    await Notification.create({
      userId: pat1._id,
      message: `Your upcoming appointment with Dr. Sarah Chen is scheduled for tomorrow at 10:00 AM.`,
      type: 'appointment',
      link: '/patient/appointments',
      read: false,
    });

    await Notification.create({
      userId: pat1._id,
      message: 'Dr. Sarah Chen, MD reviewed your health assessment and recorded clinical guidance.',
      type: 'review',
      link: '/patient/assessments',
      read: true,
    });

    await Notification.create({
      userId: doc1._id,
      message: `New health assessment submitted by Alexander Wright is awaiting clinical review.`,
      type: 'assessment',
      link: `/doctor/assessments/${ass2._id}`,
      read: false,
    });

    await Notification.create({
      userId: doc1._id,
      message: 'You have a scheduled clinical consultation with Alexander Wright tomorrow at 10:00 AM.',
      type: 'appointment',
      link: '/doctor/appointments',
      read: false,
    });

    console.log('[Seeder] Database successfully populated with realistic demo clinical records!');
  } catch (error) {
    console.error('[Seeder] Error populating database:', error);
    throw error;
  }
};

// If run directly via node seed/seedData.js
if (require.main === module) {
  const { connectDB, disconnectDB } = require('../config/db');
  (async () => {
    await connectDB();
    await seedData();
    await disconnectDB();
    process.exit(0);
  })();
}

module.exports = seedData;
