import React from 'react';
import { Activity, Heart, Scale, Droplet, Thermometer } from 'lucide-react';
import Badge from './Badge';

export const HealthMetricCard = ({
  title,
  value,
  unit,
  status = 'Normal',
  variant = 'clinical',
  iconName = 'heart',
  trend = '',
  className = '',
}) => {
  const getIcon = () => {
    switch (iconName.toLowerCase()) {
      case 'bp':
      case 'bloodpressure':
        return <Activity className="w-5 h-5 text-rose-600" />;
      case 'heart':
      case 'heartrate':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'weight':
      case 'scale':
      case 'bmi':
        return <Scale className="w-5 h-5 text-health-600" />;
      case 'glucose':
      case 'bloodglucose':
        return <Droplet className="w-5 h-5 text-amber-500" />;
      case 'temp':
      case 'temperature':
        return <Thermometer className="w-5 h-5 text-clinical-600" />;
      default:
        return <Activity className="w-5 h-5 text-health-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (status.toLowerCase()) {
      case 'optimal':
      case 'normal':
        return <Badge variant="success" size="sm">{status}</Badge>;
      case 'borderline':
      case 'elevated':
        return <Badge variant="warning" size="sm">{status}</Badge>;
      case 'high':
      case 'critical':
        return <Badge variant="danger" size="sm">{status}</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-soft hover:shadow-soft-md transition-all ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
          {getIcon()}
        </div>
      </div>

      <div className="flex items-baseline space-x-1.5 mb-2">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">
          {value || '--'}
        </span>
        {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <div>{getStatusBadge()}</div>
        {trend && <span className="text-slate-400 text-[11px]">{trend}</span>}
      </div>
    </div>
  );
};

export default HealthMetricCard;
