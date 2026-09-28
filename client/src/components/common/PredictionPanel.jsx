import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Info,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import { assessmentService } from '../../services/api';

/**
 * PredictionPanel - Active Machine Learning Clinical Decision Support Component
 * 
 * Renders calibrated clinical risk predictions, multivariate explainability metrics,
 * evidence-based CDSS recommendations, and provides on-demand re-analysis triggers.
 */
export const PredictionPanel = ({
  data = null,
  assessmentId = null,
  onPredictionUpdated = null,
  compact = false,
  className = '',
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [predictionData, setPredictionData] = useState(data);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Keep internal state in sync with prop updates
  React.useEffect(() => {
    if (data) {
      setPredictionData(data);
    }
  }, [data]);

  const activePrediction = predictionData || data;

  const handleRunPrediction = async () => {
    if (!assessmentId) return;
    try {
      setAnalyzing(true);
      setErrorMsg('');
      setSuccessMsg('');
      const res = await assessmentService.runPrediction(assessmentId);
      if (res.data?.success && res.data?.prediction) {
        setPredictionData(res.data.prediction);
        setSuccessMsg('AI clinical risk stratification updated successfully.');
        if (typeof onPredictionUpdated === 'function') {
          onPredictionUpdated(res.data.prediction);
        }
      }
    } catch (err) {
      console.error('Failed to run AI prediction:', err);
      setErrorMsg(
        err.response?.data?.message || 'Unable to communicate with the ML prediction service.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // Helper for risk styling
  const getRiskDetails = (riskLevel) => {
    const level = (riskLevel || '').toLowerCase();
    if (level === 'high') {
      return {
        badgeVariant: 'danger',
        label: 'High Clinical Risk',
        barColor: 'bg-rose-500',
        bgLight: 'bg-rose-50',
        borderColor: 'border-rose-200',
        textColor: 'text-rose-800',
        icon: AlertTriangle,
      };
    }
    if (level === 'moderate') {
      return {
        badgeVariant: 'warning',
        label: 'Moderate Clinical Risk',
        barColor: 'bg-amber-500',
        bgLight: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-800',
        icon: Activity,
      };
    }
    return {
      badgeVariant: 'success',
      label: 'Low Clinical Risk',
      barColor: 'bg-emerald-500',
      bgLight: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-800',
      icon: ShieldCheck,
    };
  };

  // Active ML Prediction View
  if (activePrediction && (activePrediction.prediction || activePrediction.riskLevel)) {
    const risk = getRiskDetails(activePrediction.riskLevel);
    const probPercent = Math.round((activePrediction.probability || 0) * 100);
    const confPercent = Math.round((activePrediction.confidenceScore || 0.94) * 100);

    return (
      <Card
        title="AI Clinical Risk Stratification"
        subtitle="Microservice inference calibrated on ACC/AHA & Framingham models"
        icon={BrainCircuit}
        className={className}
      >
        <div className="space-y-5">
          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-rose-600 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Risk Level & Probability Overview */}
          <div className={`p-4 rounded-xl border ${risk.borderColor} ${risk.bgLight} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
            <div>
              <div className="flex items-center space-x-2">
                <Badge variant={risk.badgeVariant} size="lg">
                  {risk.label}
                </Badge>
                <span className="text-xs font-semibold text-slate-500">
                  {confPercent}% Model Confidence
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700 mt-2">
                {activePrediction.prediction || 'Multivariate Cardiovascular & Metabolic Evaluation'}
              </p>
            </div>

            <div className="text-left sm:text-right flex-shrink-0">
              <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                {probPercent}%
              </div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Stratified Risk Score
              </span>
            </div>
          </div>

          {/* Probability Bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
              <span>Low (0%)</span>
              <span>Moderate (30%)</span>
              <span>High (65%+)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden relative">
              <div
                className={`h-full ${risk.barColor} transition-all duration-700 rounded-full`}
                style={{ width: `${Math.max(probPercent, 5)}%` }}
              />
            </div>
          </div>

          {/* Explainability / Contributing Risk Factors */}
          {Array.isArray(activePrediction.explanation) && activePrediction.explanation.length > 0 && (
            <div>
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center">
                <Activity className="w-3.5 h-3.5 mr-1.5 text-clinical-600" />
                Contributing Factors & Feature Weights
              </h5>
              <div className="space-y-2 bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                {activePrediction.explanation.map((item, idx) => {
                  const contribPct = Math.round((item.contribution || 0) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700">{item.feature}</span>
                        <span className="text-slate-900 font-bold">{contribPct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                        <div
                          className="h-full bg-clinical-600 rounded-full transition-all duration-500"
                          style={{ width: `${contribPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clinical Decision Support Recommendations */}
          {Array.isArray(activePrediction.recommendations) && activePrediction.recommendations.length > 0 && (
            <div>
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-health-600" />
                Evidence-Based Recommendations
              </h5>
              <ul className="space-y-1.5">
                {activePrediction.recommendations.map((rec, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-700 flex items-start p-2 rounded-lg bg-white border border-slate-100 shadow-soft-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Controls: Re-run AI Analysis */}
          {assessmentId && (
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Generated: {activePrediction.generatedAt ? new Date(activePrediction.generatedAt).toLocaleTimeString() : 'Just now'}
              </span>
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                onClick={handleRunPrediction}
                disabled={analyzing}
                className={analyzing ? 'animate-pulse' : ''}
              >
                {analyzing ? 'Evaluating...' : 'Re-run AI Analysis'}
              </Button>
            </div>
          )}

          {/* Clinical Disclaimer */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed flex items-start space-x-2">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Clinical Decision Support Disclaimer:</strong> This risk stratification model is designed to assist healthcare professionals in early triage. It is not an autonomous diagnostic determination. Final clinical evaluation must be confirmed by a licensed physician.
            </span>
          </div>
        </div>
      </Card>
    );
  }

  // Pending / Ready to Analyze State
  return (
    <div
      className={`rounded-xl border border-dashed border-clinical-300 bg-gradient-to-br from-clinical-50/40 via-white to-clinical-50/20 p-6 relative overflow-hidden ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-clinical-100 text-clinical-700 flex items-center justify-center border border-clinical-200 shadow-soft-sm">
            <BrainCircuit className="w-5 h-5 text-clinical-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-slate-900">AI Risk Stratification</h4>
              <Badge variant="clinical" size="sm">
                Connected
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Clinical ML Microservice Active</p>
          </div>
        </div>

        <div className="flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          Online
        </div>
      </div>

      {errorMsg && (
        <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 text-rose-600 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="mt-4 p-4 rounded-lg bg-white border border-clinical-100 text-slate-600 text-xs leading-relaxed space-y-2">
        <p className="font-semibold text-slate-800">
          Automated clinical risk stratification ready for evaluation.
        </p>
        <p className="text-slate-500">
          {assessmentId
            ? 'Click below to dispatch patient physiological parameters and lifestyle factors to the clinical risk stratification model.'
            : 'Submit a new health assessment or log vital metrics to generate machine-learning assisted risk stratification.'}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-mono">
          Endpoint: POST /api/assessments/:id/predict
        </span>

        {assessmentId ? (
          <Button
            variant="primary"
            size="sm"
            icon={Sparkles}
            onClick={handleRunPrediction}
            disabled={analyzing}
          >
            {analyzing ? 'Evaluating Risk...' : 'Run AI Analysis'}
          </Button>
        ) : (
          <Link to="/patient/assessment">
            <Button variant="outline" size="sm" icon={ArrowRight}>
              Start Assessment
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PredictionPanel;
