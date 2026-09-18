const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    vitals: {
      height: { type: Number, default: 0 },
      weight: { type: Number, default: 0 },
      bloodPressure: { type: String, default: '', trim: true },
      heartRate: { type: Number, default: 0 },
      temperature: { type: Number, default: 0 },
    },
    lifestyle: {
      smoking: { type: String, enum: ['Never', 'Former', 'Current Occasional', 'Current Regular', 'Not Disclosed'], default: 'Never' },
      alcohol: { type: String, enum: ['None', 'Occasional', 'Moderate', 'Frequent', 'Not Disclosed'], default: 'None' },
      physicalActivity: { type: String, enum: ['Sedentary', 'Light', 'Moderate', 'Very Active'], default: 'Moderate' },
      sleepDuration: { type: String, default: '7-8 hours' },
      diet: { type: String, enum: ['Balanced', 'Vegetarian', 'Vegan', 'Low Carb', 'High Sodium / Processed', 'Other'], default: 'Balanced' },
    },
    medicalHistory: {
      diabetes: { type: Boolean, default: false },
      hypertension: { type: Boolean, default: false },
      heartDisease: { type: Boolean, default: false },
      familyHistory: { type: String, default: '', trim: true },
      previousSurgeries: { type: String, default: '', trim: true },
      additionalNotes: { type: String, default: '', trim: true },
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'requires_followup'],
      default: 'pending',
      index: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for latest DoctorReview
assessmentSchema.virtual('review', {
  ref: 'DoctorReview',
  localField: '_id',
  foreignField: 'assessmentId',
  justOne: true,
});

module.exports = mongoose.model('Assessment', assessmentSchema);
