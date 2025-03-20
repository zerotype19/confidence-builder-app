const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  pillarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pillar',
    required: true
  },
  activitiesCompleted: [{
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    parentNotes: String,
    childReaction: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral'
    }
  }],
  challengesCompleted: [{
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    reflection: String,
    difficulty: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  achievements: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    awardedAt: {
      type: Date,
      default: Date.now
    },
    icon: String
  }],
  monthlyAssessments: [{
    date: {
      type: Date,
      default: Date.now
    },
    confidenceScore: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    strengths: [String],
    areasForImprovement: [String],
    parentObservations: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Progress', ProgressSchema);
