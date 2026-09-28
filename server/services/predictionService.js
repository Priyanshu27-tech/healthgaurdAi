/**
 * ============================================================================
 * HealthGuard AI - Machine Learning Prediction Service (Active Phase 2 Integration)
 * ============================================================================
 * 
 * Dispatches clinical risk assessment payloads to the Python/FastAPI microservice
 * running on http://127.0.0.1:8000.
 */

class PredictionService {
  /**
   * Request clinical risk prediction from the FastAPI ML microservice.
   * 
   * @param {Object} assessmentData - Standardized assessment data object
   * @returns {Promise<Object|null>} Structured prediction data or null on error
   */
  static async requestRiskPrediction(assessmentData) {
    const mlUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

    try {
      const payload = {
        symptoms: assessmentData.symptoms || [],
        vitals: assessmentData.vitals || {},
        lifestyle: assessmentData.lifestyle || {},
        medicalHistory: assessmentData.medicalHistory || {},
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${mlUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[ML Service] Inference request returned HTTP ${response.status}`);
        return null;
      }

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        console.log(`[ML Service] Prediction generated: ${resJson.data.riskLevel} Risk (Probability: ${resJson.data.probability})`);
        return resJson.data;
      }

      return null;
    } catch (err) {
      console.warn(`[ML Service] Microservice unreachable at ${mlUrl}: ${err.message}. Gracefully bypassing.`);
      return null;
    }
  }

  /**
   * Query live health check of the ML prediction microservice.
   * 
   * @returns {Promise<Object>} Connection readiness metadata
   */
  static async getServiceStatus() {
    const mlUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(`${mlUrl}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return {
          status: 'online',
          serviceConnected: true,
          engine: data.engine || 'FastAPI Clinical Risk Engine',
          version: data.version || '2.0.0',
          endpoint: `${mlUrl}/predict`,
        };
      }
    } catch (err) {
      // offline
    }

    return {
      status: 'standby',
      serviceConnected: false,
      engine: 'FastAPI Service Offline (Automatic Fallback Active)',
      endpoint: `${mlUrl}/predict`,
    };
  }
}

module.exports = PredictionService;
