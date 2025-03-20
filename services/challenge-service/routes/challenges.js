const express = require('express');
const router = express.Router();
const Challenge = require('../../models/Challenge');
const Child = require('../../models/Child');

// @route   GET api/challenges
// @desc    Get all challenges
// @access  Public
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .select('day title description pillarId')
      .sort({ day: 1 });
    
    res.json(challenges);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   GET api/challenges/:challengeId
// @desc    Get challenge details
// @access  Public
router.get('/:challengeId', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.challengeId);
    
    if (!challenge) {
      return res.status(404).json({ error: { message: 'Challenge not found' } });
    }
    
    res.json(challenge);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: { message: 'Challenge not found' } });
    }
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   GET api/challenges/day/:day
// @desc    Get challenge for specific day
// @access  Public
router.get('/day/:day', async (req, res) => {
  try {
    const day = parseInt(req.params.day);
    
    if (isNaN(day) || day < 1 || day > 30) {
      return res.status(400).json({ error: { message: 'Invalid day parameter. Must be between 1 and 30.' } });
    }
    
    const challenge = await Challenge.findOne({ day });
    
    if (!challenge) {
      return res.status(404).json({ error: { message: 'Challenge not found for this day' } });
    }
    
    res.json(challenge);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   GET api/challenges/current
// @desc    Get current day's challenge for a child
// @access  Private
router.get('/current', async (req, res) => {
  try {
    const { childId } = req.query;
    
    if (!childId) {
      return res.status(400).json({ error: { message: 'Child ID is required' } });
    }
    
    // Get child profile to determine age group
    const child = await Child.findById(childId);
    
    if (!child) {
      return res.status(404).json({ error: { message: 'Child not found' } });
    }
    
    // Check if user owns this child profile
    if (child.parentId.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to access this profile' } });
    }
    
    const { ageGroup } = child;
    
    // Calculate current day based on child's start date or use a default progression
    // For simplicity, we'll use a modulo approach to cycle through the 30-day challenge
    const startDate = child.currentPillar?.startDate || child.createdAt;
    const daysSinceStart = Math.floor((Date.now() - startDate) / (1000 * 60 * 60 * 24));
    const currentDay = (daysSinceStart % 30) + 1;
    
    const challenge = await Challenge.findOne({ day: currentDay });
    
    if (!challenge) {
      return res.status(404).json({ error: { message: 'Challenge not found for current day' } });
    }
    
    // Get age-appropriate adaptation
    const ageAdaptation = challenge.ageAdaptations[ageGroup];
    
    // Return challenge with age-specific adaptation
    res.json({
      ...challenge.toObject(),
      ageAdaptation
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
