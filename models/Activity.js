const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  pillarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pillar',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  ageGroup: {
    type: String,
    enum: ['toddler', 'elementary', 'teen', 'all'],
    required: true
  },
  duration: {
    type: Number,
    required: true,
    comment: 'Duration in minutes'
  },
  materials: [String],
  steps: [String],
  learningOutcomes: [String],
  tips: [String],
  mediaResources: [{
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'pdf'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    description: String
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', ActivitySchema);
