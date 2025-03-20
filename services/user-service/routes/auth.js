const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// @route   POST api/auth/register
// @desc    Register a new parent user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: { message: 'User already exists' } });
    }

    // Create new user
    user = new User({
      email,
      password,
      firstName,
      lastName,
      role: 'parent'
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'jwtSecret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ userId: user.id, token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: { message: 'Invalid credentials' } });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: { message: 'Invalid credentials' } });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'jwtSecret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ userId: user.id, token, role: user.role });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   POST api/auth/logout
// @desc    Log out user
// @access  Private
router.post('/logout', (req, res) => {
  // In a stateless JWT auth system, the client is responsible for removing the token
  // Server-side we just confirm the logout action
  res.json({ success: true });
});

// @route   GET api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', async (req, res) => {
  try {
    // User is retrieved from auth middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// @route   PUT api/auth/password
// @desc    Update user password
// @access  Private
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: { message: 'Current password is incorrect' } });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.updatedAt = Date.now();

    // Save updated user
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
