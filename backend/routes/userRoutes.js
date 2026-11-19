const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const appliedJobs = await Job.find({ applicants: req.user.id }).populate('postedBy', 'name');
    res.json({ user, appliedJobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.bio = req.body.bio || user.bio;
    user.skills = req.body.skills || user.skills;

    const updatedUser = await user.save();
    res.json({ 
      message: 'Profile updated successfully', 
      user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;