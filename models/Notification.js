const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['daily_reminder', 'achievement', 'pillar_transition', 'weekly_report'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  delivered: {
    type: Boolean,
    default: false
  },
  relatedEntity: {
    type: {
      type: String,
      enum: ['pillar', 'challenge', 'activity', 'achievement']
    },
    id: {
      type: mongoose.Schema.Types.ObjectId
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', NotificationSchema);
