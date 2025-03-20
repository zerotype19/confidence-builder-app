const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Child = require('../../models/Child');

// @route   GET api/children
// @desc    Get all children for current parent
// @access  Private
router.get('/', async (req, res) => {
  try {
    const children = await Child.find({ parentId: req.user.id })
      .select('firstName lastName dateOfBirth ageGroup avatar currentPillar')
      .sort({ firstName: 1 });
    
    res.json(children);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   POST api/children
// @desc    Create a new child profile
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, ageGroup, avatar, interests } = req.body;

    // Create new child profile
    const newChild = new Child({
      parentId: req.user.id,
      firstName,
      lastName,
      dateOfBirth,
      ageGroup,
      avatar,
      interests
    });

    const child = await newChild.save();
    res.json(child);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   GET api/children/:childId
// @desc    Get child profile details
// @access  Private
router.get('/:childId', async (req, res) => {
  try {
    const child = await Child.findById(req.params.childId);
    
    // Check if child exists
    if (!child) {
      return res.status(404).json({ error: { message: 'Child profile not found' } });
    }
    
    // Check if user owns this child profile
    if (child.parentId.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to access this profile' } });
    }
    
    res.json(child);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: { message: 'Child profile not found' } });
    }
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   PUT api/children/:childId
// @desc    Update child profile
// @access  Private
router.put('/:childId', async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, ageGroup, avatar, interests, notes } = req.body;
    
    // Find child profile
    let child = await Child.findById(req.params.childId);
    
    // Check if child exists
    if (!child) {
      return res.status(404).json({ error: { message: 'Child profile not found' } });
    }
    
    // Check if user owns this child profile
    if (child.parentId.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to update this profile' } });
    }
    
    // Update fields
    if (firstName) child.firstName = firstName;
    if (lastName) child.lastName = lastName;
    if (dateOfBirth) child.dateOfBirth = dateOfBirth;
    if (ageGroup) child.ageGroup = ageGroup;
    if (avatar) child.avatar = avatar;
    if (interests) child.interests = interests;
    if (notes) child.notes = notes;
    
    child.updatedAt = Date.now();
    
    // Save updated profile
    await child.save();
    
    res.json(child);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: { message: 'Child profile not found' } });
    }
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   DELETE api/children/:childId
// @desc    Delete child profile
// @access  Private
router.delete('/:childId', async (req, res) => {
  try {
    // Find child profile
    const child = await Child.findById(req.params.childId);
    
    // Check if child exists
    if (!child) {
      return res.status(404).json({ error: { message: 'Child profile not found' } });
    }
    
    // Check if user owns this child profile
    if (child.parentId.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to delete this profile' } });
    }
    
    // Delete child profile
    await child.remove();
    
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: { message: 'Child profile not found' } });
    }
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
