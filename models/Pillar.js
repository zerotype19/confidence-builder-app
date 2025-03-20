const mongoose = require('mongoose');

const PillarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  icon: {
    type: String
  },
  techniques: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    steps: [String],
    examples: [{
      scenario: String,
      incorrectResponse: String,
      correctResponse: String
    }],
    troubleshooting: [{
      problem: String,
      solution: String
    }]
  }],
  ageAdaptations: {
    toddler: {
      description: String,
      activities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
      }],
      examples: [String]
    },
    elementary: {
      description: String,
      activities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
      }],
      examples: [String]
    },
    teen: {
      description: String,
      activities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
      }],
      examples: [String]
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pillar', PillarSchema);
