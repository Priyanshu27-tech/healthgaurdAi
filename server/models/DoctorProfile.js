const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      trim: true,
    },
    hospital: {
      type: String,
      required: [true, 'Hospital / clinic name is required'],
      trim: true,
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    consultationHours: {
      type: String,
      default: 'Mon - Fri: 09:00 AM - 05:00 PM',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
