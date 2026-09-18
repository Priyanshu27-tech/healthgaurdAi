export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);
};

export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'reviewed':
    case 'completed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'pending':
    case 'scheduled':
    case 'pending review':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'requires_followup':
    case 'follow-up needed':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'cancelled':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-clinical-50 text-clinical-700 border-clinical-200';
  }
};
