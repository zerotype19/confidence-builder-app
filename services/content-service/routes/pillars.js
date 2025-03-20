const express = require('express');
const router = express.Router();
const Pillar = require('../../models/Pillar');

// @route   GET api/pillars
// @desc    Get all pillars
// @access  Public
router.get('/', async (req, res) => {
  try {
    const pillars = await Pillar.find()
      .select('name description order icon')
      .sort({ order: 1 });
    
    res.json(pillars);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   GET api/pillars/:pillarId
// @desc    Get pillar details
// @access  Public
router.get('/:pillarId', async (req, res) => {
  try {
    const pillar = await Pillar.findById(req.params.pillarId);
    
    if (!pillar) {
      return res.status(404).json({ error: { message: 'Pillar not found' } });
    }
    
    res.json(pillar);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: { message: 'Pillar not found' } });
    }
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   GET api/pillars/:pillarId/techniques
// @desc    Get techniques for a pillar
// @access  Public
router.get('/:pillarId/techniques', async (req, res) => {
  try {
    const pillar = await Pillar.findById(req.params.pillarId);
    
    if (!pillar) {
      return res.status(404).json({ error: { message: 'Pillar not found' } });
    }
    
    res.json(pillar.techniques);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: { message: 'Pillar not found' } });
    }
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   GET api/pillars/:pillarId/age-adaptations/:ageGroup
// @desc    Get age-specific adaptations for a pillar
// @access  Public
router.get('/:pillarId/age-adaptations/:ageGroup', async (req, res) => {
  try {
    const { pillarId, ageGroup } = req.params;
    
    if (!['toddler', 'elementary', 'teen'].includes(ageGroup)) {
      return res.status(400).json({ error: { message: 'Invalid age group' } });
    }
    
    const pillar = await Pillar.findById(pillarId);
    
    if (!pillar) {
      return res.status(404).json({ error: { message: 'Pillar not found' } });
    }
    
    const adaptations = pillar.ageAdaptations[ageGroup];
    
    if (!adaptations) {
      return res.status(404).json({ error: { message: 'Adaptations not found for this age group' } });
    }
    
    res.json(adaptations);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: { message: 'Pillar not found' } });
    }
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
