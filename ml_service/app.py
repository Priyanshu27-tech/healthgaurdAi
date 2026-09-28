from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from model import clinical_model

app = FastAPI(
    title="HealthGuard AI - Clinical Risk Inference Service",
    description="Microservice providing evidence-based risk stratification and explainability vectors for clinical decision support.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VitalsModel(BaseModel):
    height: Optional[float] = 175.0
    weight: Optional[float] = 72.0
    bloodPressure: Optional[str] = "120/80"
    heartRate: Optional[float] = 72.0
    temperature: Optional[float] = 98.6
    glucose: Optional[float] = 92.0

class LifestyleModel(BaseModel):
    smoking: Optional[str] = "Never"
    alcohol: Optional[str] = "None"
    physicalActivity: Optional[str] = "Moderate"
    sleepDuration: Optional[str] = "7-8 hours"
    diet: Optional[str] = "Balanced"

class MedicalHistoryModel(BaseModel):
    diabetes: Optional[bool] = False
    hypertension: Optional[bool] = False
    heartDisease: Optional[bool] = False
    familyHistory: Optional[str] = ""
    previousSurgeries: Optional[str] = ""
    additionalNotes: Optional[str] = ""

class AssessmentPredictRequest(BaseModel):
    symptoms: Optional[List[str]] = Field(default_factory=list)
    vitals: Optional[Dict[str, Any]] = Field(default_factory=dict)
    lifestyle: Optional[Dict[str, Any]] = Field(default_factory=dict)
    medicalHistory: Optional[Dict[str, Any]] = Field(default_factory=dict)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "HealthGuard AI Clinical Risk Inference Microservice",
        "engine": "Scikit-Learn Calibrated Classifier",
        "version": "2.0.0",
    }

@app.post("/predict")
def predict_risk(payload: AssessmentPredictRequest):
    try:
        data = payload.model_dump()
        result = clinical_model.predict(data)
        return {
            "success": True,
            "data": result,
        }
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(err)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
