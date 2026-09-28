import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Eye,
  Calendar,
  Activity,
  User,
  Heart,
  FileText,
} from 'lucide-react';
import { patientService } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DoctorReviewPanel from '../../components/common/DoctorReviewPanel';
import PredictionPanel from '../../components/common/PredictionPanel';
import { formatDate, formatDateTime, getStatusBadgeClass } from '../../utils/formatters';

export const AssessmentHistoryPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await patientService.getAssessments();
      if (res.data.success) {
        setAssessments(res.data.assessments);
      }
    } catch (err) {
      console.error('Error fetching assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const openDetails = (ass) => {
    setSelectedAssessment(ass);
    setModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading your assessment history..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Assessment History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological record of submitted health assessments and attending doctor reviews.
          </p>
        </div>
        <Link to="/patient/assessment">
          <Button variant="primary" icon={Plus} size="sm">
            New Assessment
          </Button>
        </Link>
      </div>

      {assessments.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No assessments yet"
          description="You haven't submitted any health assessments. Start your first assessment to record your health metrics for physician review."
          actionLabel="Start First Assessment"
          actionIcon={Plus}
          onAction={() => window.location.assign('/patient/assessment')}
        />
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Submission Date</th>
                    <th className="py-3.5 px-4">Symptoms Logged</th>
                    <th className="py-3.5 px-4">Review Status</th>
                    <th className="py-3.5 px-4">AI Risk Level</th>
                    <th className="py-3.5 px-4">Attending Physician</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assessments.map((ass) => {
                    const isReviewed = ass.status === 'reviewed';
                    const isFollowup = ass.status === 'requires_followup';
                    return (
                      <tr key={ass._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 sm:px-6 font-semibold text-slate-900 whitespace-nowrap">
                          {formatDate(ass.submittedAt)}
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          {ass.symptoms?.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {ass.symptoms.slice(0, 2).map((s, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]"
                                >
                                  {s}
                                </span>
                              ))}
                              {ass.symptoms.length > 2 && (
                                <span className="text-[11px] text-slate-400">
                                  +{ass.symptoms.length - 2} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">None reported</span>
                          )}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadgeClass(
                              ass.status
                            )}`}
                          >
                            {isFollowup
                              ? 'Follow-up Needed'
                              : isReviewed
                              ? 'Clinically Reviewed'
                              : 'Awaiting Review'}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          {ass.mlPrediction?.riskLevel ? (
                            <Badge
                              variant={
                                ass.mlPrediction.riskLevel.toLowerCase() === 'high'
                                  ? 'danger'
                                  : ass.mlPrediction.riskLevel.toLowerCase() === 'moderate'
                                  ? 'warning'
                                  : 'success'
                              }
                              size="sm"
                            >
                              {ass.mlPrediction.riskLevel} ({Math.round((ass.mlPrediction.probability || 0) * 100)}%)
                            </Badge>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Unanalyzed</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                          {ass.review?.doctorId?.name || (
                            <span className="text-slate-400 text-xs italic">Pending Assignment</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={Eye}
                            onClick={() => openDetails(ass)}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Inspection Modal */}
      {selectedAssessment && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Assessment Details — ${formatDate(selectedAssessment.submittedAt)}`}
          subtitle={`Identifier: ${selectedAssessment._id}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
            {/* Status overview banner */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-600">Clinical Evaluation Status</span>
              <Badge
                variant={
                  selectedAssessment.status === 'reviewed'
                    ? 'success'
                    : selectedAssessment.status === 'requires_followup'
                    ? 'danger'
                    : 'warning'
                }
                size="md"
              >
                {selectedAssessment.status === 'requires_followup'
                  ? 'Requires Follow-up'
                  : selectedAssessment.status === 'reviewed'
                  ? 'Reviewed by Physician'
                  : 'Awaiting Doctor Review'}
              </Badge>
            </div>

            {/* Doctor Review Feedback */}
            <DoctorReviewPanel review={selectedAssessment.review} isDoctor={false} />

            {/* Vitals Recorded */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Recorded Vitals
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Blood Pressure</span>
                  <span className="font-bold text-slate-900">
                    {selectedAssessment.vitals?.bloodPressure || 'N/A'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Heart Rate</span>
                  <span className="font-bold text-slate-900">
                    {selectedAssessment.vitals?.heartRate ? `${selectedAssessment.vitals.heartRate} bpm` : 'N/A'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Temperature</span>
                  <span className="font-bold text-slate-900">
                    {selectedAssessment.vitals?.temperature ? `${selectedAssessment.vitals.temperature} °F` : 'N/A'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Weight / Height</span>
                  <span className="font-bold text-slate-900">
                    {selectedAssessment.vitals?.weight ? `${selectedAssessment.vitals.weight} kg` : 'N/A'} /{' '}
                    {selectedAssessment.vitals?.height ? `${selectedAssessment.vitals.height} cm` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Reported Symptoms
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedAssessment.symptoms?.length > 0 ? (
                  selectedAssessment.symptoms.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-health-50 border border-health-200 text-health-800 text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No acute symptoms reported</p>
                )}
              </div>
            </div>

            {/* Lifestyle & Medical History */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-semibold text-slate-700 block">Lifestyle Parameters</span>
                <p><span className="text-slate-500">Smoking:</span> {selectedAssessment.lifestyle?.smoking || 'N/A'}</p>
                <p><span className="text-slate-500">Alcohol:</span> {selectedAssessment.lifestyle?.alcohol || 'N/A'}</p>
                <p><span className="text-slate-500">Activity:</span> {selectedAssessment.lifestyle?.physicalActivity || 'N/A'}</p>
                <p><span className="text-slate-500">Sleep:</span> {selectedAssessment.lifestyle?.sleepDuration || 'N/A'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-semibold text-slate-700 block">Medical History Baseline</span>
                <p><span className="text-slate-500">Diabetes:</span> {selectedAssessment.medicalHistory?.diabetes ? 'Yes' : 'No'}</p>
                <p><span className="text-slate-500">Hypertension:</span> {selectedAssessment.medicalHistory?.hypertension ? 'Yes' : 'No'}</p>
                <p><span className="text-slate-500">Surgeries:</span> {selectedAssessment.medicalHistory?.previousSurgeries || 'None'}</p>
                <p><span className="text-slate-500">Family History:</span> {selectedAssessment.medicalHistory?.familyHistory || 'None disclosed'}</p>
              </div>
            </div>

            {/* AI Clinical Risk Stratification Panel */}
            <PredictionPanel
              data={selectedAssessment.mlPrediction}
              assessmentId={selectedAssessment._id}
              onPredictionUpdated={(updatedPred) => {
                setSelectedAssessment((prev) => ({ ...prev, mlPrediction: updatedPred }));
                fetchAssessments();
              }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AssessmentHistoryPage;
