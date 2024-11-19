const express = require('express');
const { register, login } = require('../controllers/authController');
const { uploadMusic } = require('../controllers/musicController');
const auth = require('../middleware/auth');
const upload = require('multer')({ dest: 'uploads/' });

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/upload', auth, upload.single('file'), uploadMusic);

module.exports = router;
