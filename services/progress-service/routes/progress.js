const express = require('express');
const router = express.Router();
const Progress = require('../../models/Progress');
const Child = require('../../models/Child');

// @route   GET api/progress/:childId
// @desc    Get overall progress for a child
// @access  Private
router.get('/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    
    // Check if child exists and belongs to the user
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ error: { message: 'Child not found' } });
    }
    
    if (child.parentId.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to access this profile' } });
    }
    
    // Get progress data
    const progress = await Progress.find({ childId })
      .populate('pillarId', 'name order')
      .populate('activitiesCompleted.activityId', 'title')
      .populate('challengesCompleted.challengeId', 'title day');
    
    // Calculate overall confidence score based on monthly assessments
    let overallScore = 0;
    let assessmentCount = 0;
    
    progress.forEach(p => {
      p.monthlyAssessments.forEach(assessment => {
        overallScore += assessment.confidenceScore;
        assessmentCount++;
      });
    });
    
    const averageScore = assessmentCount > 0 ? Math.round(overallScore / assessmentCount) : 0;
    
    // Format response
    const formattedProgress = {
      childId,
      overallScore: averageScore,
      pillarProgress: progress.map(p => ({
        pillarId: p.pillarId._id,
        name: p.pillarId.name,
        completionPercentage: calculateCompletionPercentage(p),
        activitiesCompleted: p.activitiesCompleted.length,
        challengesCompleted: p.challengesCompleted.length
      })),
      activitiesCompleted: progress.reduce((total, p) => total + p.activitiesCompleted.length, 0),
      challengesCompleted: progress.reduce((total, p) => total + p.challengesCompleted.length, 0),
      achievements: progress.reduce((acc, p) => [...acc, ...p.achievements], [])
    };
    
    res.json(formattedProgress);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   GET api/progress/:childId/pillars
// @desc    Get pillar progress for a child
// @access  Private
router.get('/:childId/pillars', async (req, res) => {
  try {
    const { childId } = req.params;
    
    // Check if child exists and belongs to the user
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ error: { message: 'Child not found' } });
    }
    
    if (child.parentId.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to access this profile' } });
    }
    
    // Get progress data
    const progress = await Progress.find({ childId })
      .populate('pillarId', 'name order');
    
    // Format response
    const pillarProgress = progress.map(p => ({
      pillarId: p.pillarId._id,
      name: p.pillarId.name,
      completionPercentage: calculateCompletionPercentage(p),
      activitiesCompleted: p.activitiesCompleted.length,
      challengesCompleted: p.challengesCompleted.length
    }));
    
    res.json(pillarProgress);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   GET api/progress/:childId/pillars/:pillarId
// @desc    Get detailed progress for a specific pillar
// @access  Private
router.get('/:childId/pillars/:pillarId', async (req, res) => {
  try {
    const { childId, pillarId } = req.params;
    
    // Check if child exists and belongs to the user
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ error: { message: 'Child not found' } });
    }
    
    if (child.parentId.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to access this profile' } });
    }
    
    // Get progress data for specific pillar
    const progress = await Progress.findOne({ childId, pillarId })
      .populate('pillarId', 'name order')
      .populate('activitiesCompleted.activityId', 'title')
      .populate('challengesCompleted.challengeId', 'title day');
    
    if (!progress) {
      return res.status(404).json({ error: { message: 'Progress data not found for this pillar' } });
    }
    
    // Format response
    const pillarProgress = {
      pillarId: progress.pillarId._id,
      name: progress.pillarId.name,
      completionPercentage: calculateCompletionPercentage(progress),
      activitiesCompleted: progress.activitiesCompleted.map(a => ({
        activityId: a.activityId._id,
        title: a.activityId.title,
        completedAt: a.completedAt,
        parentNotes: a.parentNotes,
        childReaction: a.childReaction
      })),
      challengesCompleted: progress.challengesCompleted.map(c => ({
        challengeId: c.challengeId._id,
        title: c.challengeId.title,
        day: c.challengeId.day,
        completedAt: c.completedAt,
        reflection: c.reflection,
        difficulty: c.difficulty
      })),
      achievements: progress.achievements,
      monthlyAssessments: progress.monthlyAssessments
    };
    
    res.json(pillarProgress);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   POST api/progress/:childId/activities/:activityId
// @desc    Mark activity as completed
// @access  Private
router.post('/:childId/activities/:activityId', async (req, res) => {
  try {
    const { childId, activityId } = req.params;
    const { parentNotes, childReaction } = req.body;
    
    // Check if child exists and belongs to the user
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ error: { message: 'Child not found' } });
    }
    
    if (child.parentId.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to update this profile' } });
    }
    
    // Get the activity to determine its pillar
    const Activity = require('../../models/Activity');
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ error: { message: 'Activity not found' } });
    }
    
    const pillarId = activity.pillarId;
    
    // Find or create progress record for this child and pillar
    let progress = await Progress.findOne({ childId, pillarId });
    
    if (!progress) {
      progress = new Progress({
        childId,
        pillarId,
        activitiesCompleted: [],
        challengesCompleted: [],
        achievements: [],
        monthlyAssessments: []
      });
    }
    
    // Check if activity is already completed
    const activityIndex = progress.activitiesCompleted.findIndex(
      a => a.activityId.toString() === activityId
    );
    
    if (activityIndex !== -1) {
      // Update existing completion record
      progress.activitiesCompleted[activityIndex].completedAt = Date.now();
      progress.activitiesCompleted[activityIndex].parentNotes = parentNotes;
      progress.activitiesCompleted[activityIndex].childReaction = childReaction;
    } else {
      // Add new completion record
      progress.activitiesCompleted.push({
        activityId,
        completedAt: Date.now(),
        parentNotes,
        childReaction
      });
    }
    
    // Check for achievements
    const activityCount = progress.activitiesCompleted.length;
    
    // Example achievement: completing 5 activities in a pillar
    if (activityCount === 5) {
      const achievementExists = progress.achievements.some(
        a => a.name === `${progress.pillarId.name} Explorer`
      );
      
      if (!achievementExists) {
        progress.achievements.push({
          name: `${progress.pillarId.name} Explorer`,
          description: `Completed 5 activities in the ${progress.pillarId.name} pillar`,
          awardedAt: Date.now(),
          icon: 'explorer-badge.png'
        });
      }
    }
    
    // Save progress
    await progress.save();
    
    // Update child's current pillar progress percentage
    if (child.currentPillar && child.currentPillar.pillarId.toString() === pillarId.toString()) {
      child.currentPillar.completionPercentage = calculateCompletionPercentage(progress);
      await child.save();
    }
    
    res.json({ 
      success: true, 
      updatedProgress: {
        activitiesCompleted: progress.activitiesCompleted.length,
        completionPercentage: calculateCompletionPercentage(progress)
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   POST api/progress/:childId/challenges/:challengeId
// @desc    Mark challenge as completed
// @access  Private
router.post('/:childId/challenges/:challengeId', async (req, res) => {
  try {
    const { childId, challengeId } = req.params;
    const { reflection, difficulty } = req.body;
    
    // Check if child exists and belongs to the user
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ error: { message: 'Child not found' } });
    }
    
    if (child.parentId.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to update this profile' } });
    }
    
    // Get the challenge to determine its pillar
    const Challenge = require('../../models/Challenge');
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: { message: 'Challenge not found' } });
    }
    
    const pillarId = challenge.pillarId;
    
    // Find or create progress record for this child and pillar
    let progress = await Progress.findOne({ childId, pillarId });
    
    if (!progress) {
      progress = new Progress({
        childId,
        pillarId,
        activitiesCompleted: [],
        challengesCompleted: [],
        achievements: [],
        monthlyAssessments: []
      });
    }
    
    // Check if challenge is already completed
    const challengeIndex = progress.challengesCompleted.findIndex(
      c => c.challengeId.toString() === challengeId
    );
    
    if (challengeIndex !== -1) {
      // Update existing completion record
      progress.challengesCompleted[challengeIndex].completedAt = Date.now();
      progress.challengesCompleted[challengeIndex].reflection = reflection;
      progress.challengesCompleted[challengeIndex].difficulty = difficulty;
    } else {
      // Add new completion record
      progress.challengesCompleted.push({
        challengeId,
        completedAt: Date.now(),
        reflection,
        difficulty
      });
    }
    
    // Check for achievements
    const challengeCount = progress.challengesCompleted.length;
    
    // Example achievement: completing 10 challenges in a pillar
    if (challengeCount === 10) {
      const achievementExists = progress.achievements.some(
        a => a.name === `${progress.pillarId.name} Champion`
      );
      
      if (!achievementExists) {
        progress.achievements.push({
          name: `${progress.pillarId.name} Champion`,
          description: `Completed 10 challenges in the ${progress.pillarId.name} pillar`,
          awardedAt: Date.now(),
          icon: 'champion-badge.png'
        });
      }
    }
    
    // Save progress
    await progress.save();
    
    // Update child's current pillar progress percentage
    if (child.currentPillar && child.currentPillar.pillarId.toString() === pillarId.toString()) {
      child.currentPillar.completionPercentage = calculateCompletionPercentage(progress);
      await child.save();
    }
    
    // Get next challenge
    const nextDay = (challenge.day % 30) + 1;
    const nextChallenge = await Challenge.findOne({ day: nextDay })
      .select('day title description');
    
    res.json({ 
      success: true, 
      updatedProgress: {
        challengesCompleted: progress.challengesCompleted.length,
        completionPercentage: calculateCompletionPercentage(progress)
      },
      nextChallenge
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Helper function to calculate completion percentage
function calculateCompletionPercentage(progress) {
  // Define weights for different components
  const ACTIVITY_WEIGHT = 0.5;
  const CHALLENGE_WEIGHT = 0.5;
  
  // Assume target numbers
  const TARGET_ACTIVITIES = 10;
  const TARGET_CHALLENGES = 20;
  
  // Calculate component percentages
  const activityPercentage = Math.min(progress.activitiesCompleted.length / TARGET_ACTIVITIES, 1);
  const challengePercentage = Math.min(progress.challengesCompleted.length / TARGET_CHALLENGES, 1);
  
  // Calculate weighted total
  const totalPercentage = (activityPercentage * ACTIVITY_WEIGHT) + 
                          (challengePercentage * CHALLENGE_WEIGHT);
  
  // Convert to percentage and round
  return Math.round(totalPercentage * 100);
}

module.exports = router;
