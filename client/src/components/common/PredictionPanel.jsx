import React from 'react';
import { BrainCircuit, Lock, Sparkles, AlertCircle, Cpu } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';

/**
 * PredictionPanel - Architectural UI Container for Future Machine Learning Inference
 * 
 * IMPORTANT:
 * Per system specifications, ML inference is intentionally disabled in this release.
 * This component cleanly receives future prediction data contracts when the external
 * Python/FastAPI ML microservice is connected.
 * 
 * Future payload contract:
 * {
 *   prediction: string,
 *   probability: number,
 *   riskLevel: string,
 *   explanation: Array<{ feature: string, contribution: number }>
 * }
 */
export const PredictionPanel = ({
  data = null, // Future ML response prop
  compact = false,
  className = '',
}) => {
  // If in the future real ML data is passed:
  if (data && data.prediction) {
    return (
      <Card
        title="Risk Stratification & Analysis"
        subtitle="Machine Learning Assisted Insight"
        icon={BrainCircuit}
        className={className}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Assessment Focus</p>
              <p className="text-base font-bold text-slate-900">{data.prediction}</p>
            </div>
            {data.riskLevel && (
              <Badge
                variant={
                  data.riskLevel.toLowerCase() === 'high'
                    ? 'danger'
                    : data.riskLevel.toLowerCase() === 'moderate'
                    ? 'warning'
                    : 'success'
                }
                size="lg"
              >
                {data.riskLevel} Risk
              </Badge>
            )}
          </div>
          {Array.isArray(data.explanation) && data.explanation.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-slate-600 uppercase mb-2">Key Factor Contributions</h5>
              <div className="space-y-2">
                {data.explanation.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs py-1 border-b border-slate-100">
                    <span className="text-slate-600">{item.feature}</span>
                    <span className="font-semibold text-slate-800">{Math.round(item.contribution * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Phase 1 Baseline: Clean, honest architectural placeholder (Zero fake diagnoses or percentages)
  return (
    <div
      className={`rounded-xl border border-dashed border-clinical-200 bg-gradient-to-br from-clinical-50/50 via-white to-clinical-50/30 p-6 relative overflow-hidden ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-clinical-100 text-clinical-700 flex items-center justify-center border border-clinical-200/80 shadow-soft-sm">
            <BrainCircuit className="w-5 h-5 text-clinical-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-slate-900">Risk Assessment</h4>
              <Badge variant="clinical" size="sm">
                Future Integration Ready
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Clinical ML Model Connector (Phase 2)</p>
          </div>
        </div>

        <div className="flex items-center text-xs font-medium text-slate-400 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200/60">
          <Lock className="w-3.5 h-3.5 mr-1 text-slate-400" />
          Service Inactive
        </div>
      </div>

      <div className="mt-4 p-4 rounded-lg bg-white/80 border border-clinical-100 text-slate-600 text-xs leading-relaxed space-y-2">
        <p className="font-medium text-slate-800">
          ML-powered risk analysis will appear here once the prediction service is connected.
        </p>
        <p className="text-slate-500">
          In this release, all health reviews and observations are conducted exclusively by certified medical professionals. No automated diagnostic inference is generated.
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center">
          <Cpu className="w-3 h-3 mr-1 text-slate-400" />
          Endpoint: POST /api/predictions
        </span>
        <span>Schema v1.0 Ready</span>
      </div>
    </div>
  );
};

export default PredictionPanel;
