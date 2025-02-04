exports.uploadMusic = async (req, res) => {
  try {
    const { title, artist } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const music = {
      title,
      artist,
      fileUrl: `/uploads/${req.file.filename}`,  
      user: req.user?.userId || 'guest',  
    };

    console.log('Uploaded music:', music);

    res.status(201).json(music);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
