const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});
// Get follower and following counts for a user
router.get('/follow-counts/:username', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return only the follower and following counts
      res.json({
        followersCount: user.followers.length, // Count of followers
        followingCount: user.following.length, // Count of following
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching follow counts', error: error.message });
    }
  });
  
// Get user profile
router.get('/profile/:username', async (req, res) => {
    try {
      const { username } = req.params;
  
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Fetch followers count and following count
      const followersCount = await User.countDocuments({ following: username });
      const followingCount = user.following.length;
  
      res.json({
        ...user.toObject(),
        followersCount,
        followingCount
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

// Image upload endpoint
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl, message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Update user profile
router.put('/profile/update', async (req, res) => {
  try {
    const { username, bio, profilePicture, name, email } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { $set: { bio, profilePicture, name, email } },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Follow a user
router.post('/follow/:targetUsername', async (req, res) => {
  try {
    const { targetUsername } = req.params;
    const { currentUsername } = req.body;
    console.log('target',targetUsername);
    console.log('current',currentUsername);

    if (targetUsername === currentUsername) {
      return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    const targetUser = await User.findOne({ username: targetUsername });
    const currentUser = await User.findOne({ username: currentUsername });

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (targetUser.followers.includes(currentUsername)) {
      return res.status(400).json({ message: 'You are already following this user.' });
    }

    targetUser.followers.push(currentUsername);
    targetUser.followersCount += 1;

    currentUser.following.push(targetUsername);
    currentUser.followingCount += 1;

    await targetUser.save();
    await currentUser.save();

    res.status(200).json({ message: 'Followed successfully.' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Unfollow a user
router.post('/unfollow/:targetUsername', async (req, res) => {
  try {
    const { targetUsername } = req.params;
    const { currentUsername } = req.body;

    if (targetUsername === currentUsername) {
      return res.status(400).json({ message: 'You cannot unfollow yourself.' });
    }

    const targetUser = await User.findOne({ username: targetUsername });
    const currentUser = await User.findOne({ username: currentUsername });

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!targetUser.followers.includes(currentUsername)) {
      return res.status(400).json({ message: 'You are not following this user.' });
    }

    targetUser.followers = targetUser.followers.filter((user) => user !== currentUsername);
    targetUser.followersCount -= 1;

    currentUser.following = currentUser.following.filter((user) => user !== targetUsername);
    currentUser.followingCount -= 1;

    await targetUser.save();
    await currentUser.save();

    res.status(200).json({ message: 'Unfollowed successfully.' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
