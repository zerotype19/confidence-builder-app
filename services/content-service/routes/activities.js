const express = require('express');
const router = express.Router();
const Activity = require('../../models/Activity');
const Child = require('../../models/Child');

// @route   GET api/activities
// @desc    Get all activities
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { pillarId, ageGroup } = req.query;
    const query = {};
    
    if (pillarId) query.pillarId = pillarId;
    if (ageGroup) query.ageGroup = ageGroup === 'all' ? { $in: ['toddler', 'elementary', 'teen', 'all'] } : { $in: [ageGroup, 'all'] };
    
    const activities = await Activity.find(query)
      .select('title description pillarId ageGroup duration difficulty')
      .sort({ title: 1 });
    
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   GET api/activities/:activityId
// @desc    Get activity details
// @access  Public
router.get('/:activityId', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);
    
    if (!activity) {
      return res.status(404).json({ error: { message: 'Activity not found' } });
    }
    
    res.json(activity);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: { message: 'Activity not found' } });
    }
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   GET api/activities/recommended
// @desc    Get recommended activities for a child
// @access  Private
router.get('/recommended', async (req, res) => {
  try {
    const { childId } = req.query;
    
    if (!childId) {
      return res.status(400).json({ error: { message: 'Child ID is required' } });
    }
    
    // Get child profile to determine age group and current pillar
    const child = await Child.findById(childId);
    
    if (!child) {
      return res.status(404).json({ error: { message: 'Child not found' } });
    }
    
    // Check if user owns this child profile
    if (child.parentId.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to access this profile' } });
    }
    
    const { ageGroup } = child;
    const pillarId = child.currentPillar?.pillarId;
    
    // Query for activities matching the child's age group and current pillar
    const query = {
      ageGroup: { $in: [ageGroup, 'all'] }
    };
    
    if (pillarId) {
      query.pillarId = pillarId;
    }
    
    const activities = await Activity.find(query)
      .select('title description pillarId ageGroup duration difficulty')
      .sort({ difficulty: 1 })
      .limit(5);
    
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
