import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Search, Filter, Eye, ChevronRight, Activity, Calendar } from 'lucide-react';
import { doctorService } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';

export const DoctorPatientsPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await doctorService.getPatients({
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      if (res.data.success) {
        setPatients(res.data.patients);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPatients();
  };

  const filterTabs = [
    { id: 'all', label: 'All Patients' },
    { id: 'pending', label: 'Pending Review' },
    { id: 'reviewed', label: 'Reviewed' },
    { id: 'new', label: 'New Patients' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active roster of assigned and admitted patients under clinical observation.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-soft">
        <form onSubmit={handleSearch} className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-clinical-500"
          />
        </form>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === tab.id
                  ? 'bg-clinical-600 text-white shadow-soft-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Table */}
      {loading ? (
        <LoadingSpinner size="lg" text="Searching patient records..." />
      ) : patients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients match your search"
          description="Try changing the filter options or search keyword to locate patient charts."
          actionLabel="Reset Search"
          onAction={() => {
            setSearchTerm('');
            setStatusFilter('all');
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Patient Name</th>
                  <th className="py-3.5 px-4">Age / Gender</th>
                  <th className="py-3.5 px-4">Latest Vitals</th>
                  <th className="py-3.5 px-4">Last Assessment</th>
                  <th className="py-3.5 px-4">Clinical Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((p) => {
                  const bp = p.profile?.bloodPressure || p.latestAssessment?.vitals?.bloodPressure;
                  const hr = p.profile?.heartRate || p.latestAssessment?.vitals?.heartRate;

                  return (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.email}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-700 whitespace-nowrap">
                        {p.age ? `${p.age} yrs` : 'N/A'} • {p.gender || 'Not specified'}
                      </td>
                      <td className="py-4 px-4 text-slate-700 whitespace-nowrap">
                        {bp ? (
                          <span>
                            BP: <strong className="text-slate-900">{bp}</strong>
                            {hr ? ` • ${hr} bpm` : ''}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No vitals logged</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                        {p.latestAssessment ? (
                          formatDate(p.latestAssessment.submittedAt)
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadgeClass(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Eye}
                          onClick={() => navigate(`/doctor/patients/${p._id}`)}
                        >
                          Medical Chart
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatientsPage;
