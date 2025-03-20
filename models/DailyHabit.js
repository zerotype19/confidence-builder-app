const mongoose = require('mongoose');

const DailyHabitSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  confidenceQuestion: {
    question: {
      type: String,
      required: true
    },
    answer: String,
    parentFeedback: String
  },
  dailyChallenge: {
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    completed: {
      type: Boolean,
      default: false
    },
    notes: String
  },
  mood: {
    type: String,
    enum: ['happy', 'neutral', 'sad', 'excited', 'anxious', 'frustrated'],
    default: 'neutral'
  },
  highlights: [String],
  struggles: [String]
}, {
  timestamps: true
});

// Create a compound index on childId and date to ensure uniqueness
DailyHabitSchema.index({ childId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyHabit', DailyHabitSchema);
