const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.floor(Math.random() * 1000000);
    const filename = 'profile-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

router.get("/:username/likedSongs", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).populate("likedSongs");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.likedSongs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/follow-counts/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      followersCount: user.followers.length,
      followingCount: user.following.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching follow counts', error: error.message });
  }
});

router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl, message: 'Image uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

router.post('/follow/:targetUsername', async (req, res) => {
  try {
    const { targetUsername } = req.params;
    const { currentUsername } = req.body;

    if (targetUsername === currentUsername) {
      return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    const [targetUser, currentUser] = await Promise.all([
      User.findOne({ username: targetUsername }),
      User.findOne({ username: currentUsername }),
    ]);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (targetUser.followers.includes(currentUser._id)) {
      return res.status(400).json({ message: 'You are already following this user.' });
    }

    targetUser.followers.push(currentUser.username);
    targetUser.followersCount += 1;

    currentUser.following.push(targetUser.username);
    currentUser.followingCount += 1;

    await Promise.all([targetUser.save(), currentUser.save()]);

    res.status(200).json({ message: 'Followed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/unfollow/:targetUsername', async (req, res) => {
  try {
    const { targetUsername } = req.params;
    const { currentUsername } = req.body;

    if (targetUsername === currentUsername) {
      return res.status(400).json({ message: 'You cannot unfollow yourself.' });
    }

    const [targetUser, currentUser] = await Promise.all([
      User.findOne({ username: targetUsername }),
      User.findOne({ username: currentUsername }),
    ]);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!targetUser.followers.includes(currentUsername)) {
      return res.status(400).json({ message: 'You are not following this user.' });
    }

    targetUser.followers = targetUser.followers.filter(
      (follower) => follower !== currentUsername
    );
    targetUser.followersCount = Math.max(0, targetUser.followersCount - 1);

    currentUser.following = currentUser.following.filter(
      (following) => following !== targetUsername
    );
    currentUser.followingCount = Math.max(0, currentUser.followingCount - 1);

    await Promise.all([targetUser.save(), currentUser.save()]);

    res.status(200).json({ message: 'Unfollowed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.put('/profile/update', upload.single('profilePicture'), async (req, res) => {
  const { username, bio, name, email } = req.body;
  const profilePicturePath = req.file ? req.file.path : null;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { bio, name, email, profilePicture: profilePicturePath },
      { new: true }
    );

    if (updatedUser) {
      res.json({ success: true, message: 'Profile updated successfully!', updatedUser });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

router.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const followersCount = await User.countDocuments({ following: user._id });
    const followingCount = user.following.length;

    res.json({
      ...user.toObject(),
      followersCount,
      followingCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

router.get('/following/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .populate('following', 'username name bio profilePicture');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user.following);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch following users.' });
  }
});

module.exports = router;
