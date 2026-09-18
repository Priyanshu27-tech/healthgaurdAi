import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  icon: Icon = null,
  className = '',
  bodyClassName = 'p-6',
  headerClassName = 'px-6 py-4 border-b border-slate-100',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 shadow-soft hover:shadow-soft-md transition-shadow duration-200 ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className={`flex items-center justify-between ${headerClassName}`}>
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="w-8 h-8 rounded-lg bg-health-50 text-health-700 flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="flex items-center space-x-2">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};

export default Card;
