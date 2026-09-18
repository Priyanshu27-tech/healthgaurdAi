const mongoose = require('mongoose');

const doctorReviewSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    notes: {
      type: String,
      required: [true, 'Clinical notes are required for review'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'requires_followup'],
      required: true,
      default: 'reviewed',
    },
    reviewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DoctorReview', doctorReviewSchema);
