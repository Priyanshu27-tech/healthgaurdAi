const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    height: {
      type: Number, // in cm
      default: 0,
    },
    weight: {
      type: Number, // in kg
      default: 0,
    },
    bloodPressure: {
      type: String, // e.g. "120/80"
      default: '',
      trim: true,
    },
    heartRate: {
      type: Number, // bpm
      default: 0,
    },
    glucose: {
      type: Number, // mg/dL
      default: 0,
    },
    allergies: {
      type: [String],
      default: [],
    },
    conditions: {
      type: [String],
      default: [],
    },
    medications: {
      type: [String],
      default: [],
    },
    emergencyContact: {
      name: { type: String, default: '', trim: true },
      relationship: { type: String, default: '', trim: true },
      phone: { type: String, default: '', trim: true },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for calculating BMI if height and weight exist
patientProfileSchema.virtual('bmi').get(function () {
  if (this.height > 0 && this.weight > 0) {
    const heightInMeters = this.height / 100;
    return parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(1));
  }
  return null;
});

module.exports = mongoose.model('PatientProfile', patientProfileSchema);
