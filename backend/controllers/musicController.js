exports.uploadMusic = async (req, res) => {
  try {
    const { title, artist } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const music = {
      title,
      artist,
      fileUrl: `/uploads/${req.file.filename}`,  // File URL based on filename
      user: req.user?.userId || 'guest',  // Assuming user info is attached to req.user by auth middleware
    };

    // For now, we are just returning the mocked music object
    // If you had a database, you would save the music object here instead
    console.log('Uploaded music:', music);

    // Respond with the saved (mocked) music object
    res.status(201).json(music);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
