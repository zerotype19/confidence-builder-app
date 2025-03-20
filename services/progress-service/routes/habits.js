const express = require('express');
const router = express.Router();
const DailyHabit = require('../../models/DailyHabit');
const Child = require('../../models/Child');

// @route   GET api/habits/:childId
// @desc    Get daily habits for a child
// @access  Private
router.get('/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    const { startDate, endDate } = req.query;
    
    // Check if child exists and belongs to the user
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ error: { message: 'Child not found' } });
    }
    
    if (child.parentId.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to access this profile' } });
    }
    
    // Build query
    const query = { childId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    // Get habits
    const habits = await DailyHabit.find(query)
      .populate('dailyChallenge.challengeId', 'title description')
      .sort({ date: -1 });
    
    res.json(habits);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   POST api/habits/:childId
// @desc    Record daily habit for a child
// @access  Private
router.post('/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    const { date, confidenceQuestion, dailyChallenge, mood, highlights, struggles } = req.body;
    
    // Check if child exists and belongs to the user
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ error: { message: 'Child not found' } });
    }
    
    if (child.parentId.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to update this profile' } });
    }
    
    // Check if habit already exists for this date
    let habit = await DailyHabit.findOne({ 
      childId,
      date: new Date(date || Date.now()).setHours(0, 0, 0, 0)
    });
    
    if (habit) {
      // Update existing habit
      if (confidenceQuestion) habit.confidenceQuestion = confidenceQuestion;
      if (dailyChallenge) habit.dailyChallenge = dailyChallenge;
      if (mood) habit.mood = mood;
      if (highlights) habit.highlights = highlights;
      if (struggles) habit.struggles = struggles;
    } else {
      // Create new habit
      habit = new DailyHabit({
        childId,
        date: date || Date.now(),
        confidenceQuestion,
        dailyChallenge,
        mood,
        highlights,
        struggles
      });
    }
    
    await habit.save();
    
    res.json({ habitId: habit._id, date: habit.date });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   GET api/habits/:childId/today
// @desc    Get today's habits for a child
// @access  Private
router.get('/:childId/today', async (req, res) => {
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
    
    // Get today's date (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get habit
    let habit = await DailyHabit.findOne({ 
      childId,
      date: today
    }).populate('dailyChallenge.challengeId', 'title description');
    
    if (!habit) {
      // Create empty habit for today
      habit = {
        childId,
        date: today,
        confidenceQuestion: {
          question: generateConfidenceQuestion(child.ageGroup),
          answer: '',
          parentFeedback: ''
        },
        dailyChallenge: {
          completed: false,
          notes: ''
        },
        mood: 'neutral',
        highlights: [],
        struggles: []
      };
    }
    
    res.json(habit);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Helper function to generate age-appropriate confidence questions
function generateConfidenceQuestion(ageGroup) {
  const questions = {
    toddler: [
      "What made you feel happy today?",
      "What was something you did all by yourself?",
      "What was something new you tried today?",
      "What was your favorite part of today?",
      "Who did you play with today?"
    ],
    elementary: [
      "What was something challenging you did today?",
      "When did you feel proud of yourself today?",
      "What problem did you solve today?",
      "What's something kind you did for someone else?",
      "What's something you learned today?"
    ],
    teen: [
      "What's something you accomplished today that you're proud of?",
      "When did you step outside your comfort zone today?",
      "How did you handle a difficult situation today?",
      "What's something you did today that shows your strengths?",
      "What's a goal you're working toward right now?"
    ]
  };
  
  const ageQuestions = questions[ageGroup] || questions.elementary;
  const randomIndex = Math.floor(Math.random() * ageQuestions.length);
  
  return ageQuestions[randomIndex];
}

module.exports = router;
