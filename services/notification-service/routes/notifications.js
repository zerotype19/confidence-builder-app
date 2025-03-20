const express = require('express');
const router = express.Router();
const Notification = require('../../models/Notification');

// @route   GET api/notifications
// @desc    Get all notifications for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { read, limit = 20, offset = 0 } = req.query;
    const query = { userId: req.user.id };
    
    if (read !== undefined) {
      query.read = read === 'true';
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));
    
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   GET api/notifications/unread
// @desc    Get unread notifications for current user
// @access  Private
router.get('/unread', async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id,
      read: false
    })
    .sort({ createdAt: -1 })
    .select('type title message createdAt relatedEntity');
    
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   PUT api/notifications/:notificationId/read
// @desc    Mark notification as read
// @access  Private
router.put('/:notificationId/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    
    if (!notification) {
      return res.status(404).json({ error: { message: 'Notification not found' } });
    }
    
    // Check if notification belongs to user
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to update this notification' } });
    }
    
    notification.read = true;
    await notification.save();
    
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: { message: 'Notification not found' } });
    }
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   PUT api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user.id, read: false },
      { $set: { read: true } }
    );
    
    res.json({ success: true, count: result.nModified });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   POST api/notifications/preferences
// @desc    Update notification preferences
// @access  Private
router.post('/preferences', async (req, res) => {
  try {
    const { dailyReminders, challengeNotifications, achievementAlerts, weeklyReports } = req.body;
    
    // Update user preferences
    const User = require('../../models/User');
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }
    
    // Update notification preferences
    if (dailyReminders !== undefined) {
      user.preferences.dailyReminders = dailyReminders;
    }
    
    if (challengeNotifications !== undefined || achievementAlerts !== undefined || weeklyReports !== undefined) {
      // These would be added to the User model if needed
      // For now, we'll just acknowledge the request
    }
    
    await user.save();
    
    res.json({ preferences: user.preferences });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
