import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-slate-200 border-t-health-600 animate-spin`}
      />
      {text && <p className="text-sm font-medium text-slate-500">{text}</p>}
    </div>
  );
};

export const Skeleton = ({ className = '' }) => {
  return <div className={`animate-pulse bg-slate-200/70 rounded ${className}`} />;
};

export default LoadingSpinner;
