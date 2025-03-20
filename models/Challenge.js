const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
    min: 1,
    max: 30
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
  pillarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pillar',
    required: true
  },
  ageAdaptations: {
    toddler: {
      description: String,
      tips: [String]
    },
    elementary: {
      description: String,
      tips: [String]
    },
    teen: {
      description: String,
      tips: [String]
    }
  },
  reflectionPrompts: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
