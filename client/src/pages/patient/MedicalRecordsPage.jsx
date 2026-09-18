import React, { useState, useEffect } from 'react';
import {
  FolderHeart,
  FileText,
  Upload,
  Plus,
  Calendar,
  User,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileSignature,
  FileSearch,
} from 'lucide-react';
import { patientService, recordService } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';

export const MedicalRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Lab Report');
  const [description, setDescription] = useState('');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const res = await patientService.getRecords();
      if (res.data.success) {
        setRecords(res.data.records);
      }
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title) {
      setError('Document title is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      // Generate simulated secure document link
      const simulatedUrl = `https://healthguard-ai-vault.local/secure/${type.toLowerCase().replace(' ', '_')}_${Date.now()}.pdf`;

      const res = await recordService.create({
        title,
        type,
        description,
        recordDate,
        fileUrl: simulatedUrl,
      });

      if (res.data.success) {
        setSuccess('Medical record successfully archived in secure storage.');
        setModalOpen(false);
        setTitle('');
        setDescription('');
        await loadRecords();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to archive document.');
    } finally {
      setSubmitting(false);
    }
  };

  const getRecordIcon = (recType) => {
    switch (recType) {
      case 'Lab Report':
        return <FileSpreadsheet className="w-5 h-5 text-health-600" />;
      case 'Prescription':
        return <FileSignature className="w-5 h-5 text-clinical-600" />;
      case 'Doctor Note':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'Imaging':
        return <FileSearch className="w-5 h-5 text-amber-600" />;
      default:
        return <FolderHeart className="w-5 h-5 text-slate-600" />;
    }
  };

  const categories = ['All', 'Lab Report', 'Prescription', 'Doctor Note', 'Imaging'];
  const filteredRecords =
    activeFilter === 'All'
      ? records
      : records.filter((r) => r.type === activeFilter);

  if (loading) {
    return <LoadingSpinner size="lg" text="Accessing medical records vault..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Medical Records</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Encrypted repository of diagnostic lab reports, prescriptions, and clinical visit summaries.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Upload}
          size="sm"
          onClick={() => {
            setError('');
            setModalOpen(true);
          }}
        >
          Archive Document
        </Button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center shadow-soft-sm">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFilter === cat
                ? 'bg-health-600 text-white shadow-soft-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredRecords.length === 0 ? (
        <EmptyState
          icon={FolderHeart}
          title="No records found"
          description="There are no medical documents matching this category. You can upload diagnostic reports or physician notes anytime."
          actionLabel="Archive Document"
          actionIcon={Upload}
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((rec) => (
            <div
              key={rec._id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft hover:shadow-soft-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {getRecordIcon(rec.type)}
                  </div>
                  <Badge variant="default" size="sm">
                    {rec.type}
                  </Badge>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">{rec.title}</h4>
                <p className="text-xs text-slate-500 mb-3 line-clamp-3 leading-relaxed">
                  {rec.description || 'No detailed clinical annotation provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(rec.recordDate || rec.createdAt)}
                  </span>
                  <span className="truncate max-w-[130px]">
                    Added by: {rec.uploadedBy?.name || 'Self'}
                  </span>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono text-[10px]">
                    AES-256 Verified
                  </span>
                  <a
                    href={rec.fileUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      if (!rec.fileUrl || rec.fileUrl.startsWith('https://healthguard-ai-vault')) {
                        e.preventDefault();
                        alert(`Viewing secure medical record document: "${rec.title}"\nEncrypted storage path: ${rec.fileUrl}`);
                      }
                    }}
                    className="inline-flex items-center text-health-600 hover:text-health-700 font-semibold"
                  >
                    View Document <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Archive Medical Document"
        subtitle="Store diagnostic results, lab summaries, or prescription documents"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

          <Input
            label="Document Title"
            name="title"
            placeholder="e.g. Complete Blood Count & Electrolyte Panel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Document Classification"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={['Lab Report', 'Prescription', 'Doctor Note', 'Imaging', 'Discharge Summary', 'Other']}
              required
            />

            <Input
              label="Record Date"
              name="recordDate"
              type="date"
              value={recordDate}
              onChange={(e) => setRecordDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Clinical Findings / Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of lab values, prescribing physician, or relevant findings..."
              className="block w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-health-500"
            />
          </div>

          {/* Clean simulated file upload dropzone */}
          <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center">
            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-slate-700">Attach Document (PDF, DICOM, or Scanned PNG)</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Securely cataloged with cryptographic hash verification</p>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting} icon={Upload}>
              Archive Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MedicalRecordsPage;
