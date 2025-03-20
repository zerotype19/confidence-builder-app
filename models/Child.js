const mongoose = require('mongoose');

const ChildSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  ageGroup: {
    type: String,
    enum: ['toddler', 'elementary', 'teen'],
    required: true
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  currentPillar: {
    pillarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pillar'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    completionPercentage: {
      type: Number,
      default: 0
    }
  },
  strengths: [String],
  interests: [String],
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Child', ChildSchema);
