import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, Clock, AlertTriangle, Send } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import Select from './Select';
import { formatDate, formatDateTime } from '../../utils/formatters';

export const DoctorReviewPanel = ({
  review = null,
  isDoctor = false,
  onSubmitReview = null,
  isSubmitting = false,
  className = '',
}) => {
  const [notes, setNotes] = useState(review?.notes || '');
  const [status, setStatus] = useState(review?.status || 'reviewed');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('Please provide clinical review notes.');
      return;
    }
    setError('');
    if (onSubmitReview) {
      onSubmitReview({ notes, status });
    }
  };

  // If already reviewed and not in editing mode
  if (review && !isDoctor) {
    const isFollowup = review.status === 'requires_followup';

    return (
      <Card
        title="Doctor's Clinical Review"
        subtitle={`Evaluated by ${review.doctorId?.name || 'Attending Physician'}`}
        icon={Stethoscope}
        className={`border-l-4 ${isFollowup ? 'border-l-rose-500' : 'border-l-health-600'} ${className}`}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Badge variant={isFollowup ? 'danger' : 'success'} size="md">
                {isFollowup ? 'Requires Follow-up' : 'Clinically Reviewed'}
              </Badge>
              <span className="text-xs text-slate-500 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {formatDateTime(review.reviewedAt || review.createdAt)}
              </span>
            </div>
            <span className="text-xs font-medium text-slate-600">
              Provider: {review.doctorId?.name || 'Dr. Sarah Chen, MD'}
            </span>
          </div>

          <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {review.notes}
          </div>

          {isFollowup && (
            <div className="flex items-center p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 mr-2 flex-shrink-0" />
              <span>
                Your doctor recommends scheduling a follow-up consultation regarding your assessment.
              </span>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Doctor review form (for physician evaluation)
  if (isDoctor) {
    return (
      <Card
        title="Physician Clinical Review"
        subtitle="Evaluate assessment and provide structured guidance"
        icon={Stethoscope}
        className={className}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Clinical Notes & Recommendations <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                if (error) setError('');
              }}
              placeholder="Record your clinical observations, lifestyle recommendations, or required diagnostic follow-ups..."
              className="block w-full rounded-lg border border-slate-200 p-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-health-500"
            />
            {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Select
              label="Review Determination"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: 'reviewed', label: 'Reviewed (Parameters Stable)' },
                { value: 'requires_followup', label: 'Requires Follow-up Consultation' },
              ]}
            />

            <div className="sm:pt-5">
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                icon={Send}
                className="w-full"
              >
                {review ? 'Update Clinical Review' : 'Submit Clinical Review'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    );
  }

  // Not yet reviewed patient view
  return (
    <div className={`p-5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-800 ${className}`}>
      <div className="flex items-center space-x-3">
        <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-amber-900">Awaiting Doctor Review</h4>
          <p className="text-xs text-amber-700 mt-0.5">
            Your assessment has been queued for physician review. Clinical feedback will appear here once finalized.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorReviewPanel;
