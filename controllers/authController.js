const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  location: user.location || '',
  contactNumber: user.contactNumber || '',
  profilePicture: user.profilePicture || ''
});

// Register - save new user to database
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      message: 'Account created',
      token,
      user: userResponse(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: 'Login successful',
      token,
      user: userResponse(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get own profile (requires auth)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(userResponse(user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update profile (requires auth)
exports.updateProfile = async (req, res) => {
  try {
    const { name, location, contactNumber, profilePicture } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (location !== undefined) updates.location = location;
    if (contactNumber !== undefined) updates.contactNumber = contactNumber;
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(userResponse(user));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
