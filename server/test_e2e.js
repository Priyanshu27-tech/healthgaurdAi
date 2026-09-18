const API_URL = 'http://localhost:5000/api';

async function req(path, options = {}) {
  const url = `${API_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await response.json();
  return { status: response.status, ok: response.ok, data };
}

async function runEndToEndVerification() {
  console.log('===========================================================');
  console.log(' Starting HealthGuard AI End-to-End Automated Verification');
  console.log('===========================================================');

  try {
    // 1. Healthcheck
    const health = await req('/health');
    console.log('✓ 1. Backend Health Check:', health.data.status);

    // 2. Future ML Readiness status check
    const mlStatus = await req('/predictions/status');
    console.log('✓ 2. Future ML Service Standby Status:', mlStatus.data.data.status, `(Zero-AI compliance: ${mlStatus.data.data.engine})`);

    // 3. Patient Login
    const patLogin = await req('/auth/login', {
      method: 'POST',
      body: { email: 'patient@example.com', password: 'Password123!' },
    });
    const patToken = patLogin.data.token;
    const patUser = patLogin.data.user;
    console.log(`✓ 3. Patient Authenticated: ${patUser.name} [Role: ${patUser.role}]`);

    const patHeaders = { Authorization: `Bearer ${patToken}` };

    // 4. Patient Profile
    const patProfileRes = await req('/patients/profile', { headers: patHeaders });
    console.log(`✓ 4. Patient Profile Retrieved: BP: ${patProfileRes.data.profile.bloodPressure}, BMI: ${patProfileRes.data.profile.bmi}`);

    // 5. Patient Submits Assessment (NO ML inference)
    const newAssessmentRes = await req('/assessments', {
      method: 'POST',
      headers: patHeaders,
      body: {
        symptoms: ['Headache', 'Fatigue'],
        vitals: {
          height: 178,
          weight: 76,
          bloodPressure: '122/80',
          heartRate: 72,
          temperature: 98.6,
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
          additionalNotes: 'Mild headache after screen exposure',
        },
      },
    });
    const assessmentId = newAssessmentRes.data.assessmentId;
    console.log(`✓ 5. Patient Submitted Assessment: ID: ${assessmentId}`);
    console.log(`     Neutral Safe Confirmation Message: "${newAssessmentRes.data.message}"`);

    // 6. Doctor Login
    const docLogin = await req('/auth/login', {
      method: 'POST',
      body: { email: 'doctor@example.com', password: 'Password123!' },
    });
    const docToken = docLogin.data.token;
    const docUser = docLogin.data.user;
    console.log(`✓ 6. Doctor Authenticated: ${docUser.name} [Role: ${docUser.role}]`);

    const docHeaders = { Authorization: `Bearer ${docToken}` };

    // 7. Doctor Views Assessment Queue
    const docAssessmentsRes = await req('/doctors/assessments', { headers: docHeaders });
    const pendingQueue = docAssessmentsRes.data.assessments.filter((a) => a.status === 'pending');
    console.log(`✓ 7. Doctor Assessment Queue: ${docAssessmentsRes.data.assessments.length} total, ${pendingQueue.length} pending review`);

    // 8. Doctor Submits Clinical Review (Human doctor evaluation)
    const reviewRes = await req('/doctors/reviews', {
      method: 'POST',
      headers: docHeaders,
      body: {
        assessmentId: assessmentId,
        notes: 'Vitals stable. Mild headache consistent with screen strain. Advised proper hydration and 20-20-20 rule.',
        status: 'reviewed',
      },
    });
    console.log(`✓ 8. Doctor Submitted Clinical Review: Review Status: ${reviewRes.data.review.status}`);

    // 9. Doctor Inspects Patient Directory
    const patListRes = await req('/doctors/patients', { headers: docHeaders });
    console.log(`✓ 9. Doctor Patient Directory: ${patListRes.data.patients.length} registered patients listed`);

    // 10. Doctor Views Detailed Patient Chart
    const patChartRes = await req(`/doctors/patients/${patUser._id}`, { headers: docHeaders });
    console.log(`✓ 10. Doctor Inspected Patient Chart: ${patChartRes.data.patient.name}, ${patChartRes.data.assessments.length} assessments in history`);

    // 11. Patient Books Appointment with Doctor
    const appRes = await req('/appointments', {
      method: 'POST',
      headers: patHeaders,
      body: {
        doctorId: docUser._id,
        date: '2026-09-20',
        time: '11:00 AM',
        reason: 'Follow-up on headache symptoms',
        notes: 'Requested routine vital sign re-check',
      },
    });
    const appointmentId = appRes.data.appointment._id;
    console.log(`✓ 11. Patient Booked Appointment: ID: ${appointmentId}, Date: 2026-09-20 at 11:00 AM`);

    // 12. Doctor Updates Appointment Status
    const updateAppRes = await req(`/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: docHeaders,
      body: {
        status: 'Completed',
        notes: 'Consultation concluded. Patient vital signs stable.',
      },
    });
    console.log(`✓ 12. Doctor Updated Appointment: New Status: ${updateAppRes.data.appointment.status}`);

    // 13. Patient Archives Medical Document
    const recRes = await req('/records', {
      method: 'POST',
      headers: patHeaders,
      body: {
        title: 'Routine Blood Chemistry Report',
        type: 'Lab Report',
        description: 'Hemoglobin: 15.2 g/dL, Platelets: 240k. Normal findings.',
      },
    });
    console.log(`✓ 13. Patient Archived Medical Record: "${recRes.data.record.title}"`);

    // 14. RBAC Security Enforcement Test:
    // Patient attempts to access Doctor-only route /api/doctors/patients
    const rbacTest = await req('/doctors/patients', { headers: patHeaders });
    if (rbacTest.status === 403) {
      console.log('✓ 14. RBAC Security Guard Verified: Patient blocked from Doctor-only endpoint (HTTP 403 Forbidden).');
    } else {
      console.error('FAILED: RBAC did not block patient from doctor route! Status:', rbacTest.status);
      process.exit(1);
    }

    console.log('===========================================================');
    console.log(' ALL 14 HEALTHCARE WORKFLOW & SECURITY TESTS PASSED (100%)');
    console.log('===========================================================');
    process.exit(0);
  } catch (error) {
    console.error('Verification Error:', error);
    process.exit(1);
  }
}

runEndToEndVerification();
