const express = require('express');
const router = express.Router();
const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

router.get('/messages', (req, res) => {
    res.json({ message: 'Server for messages is working!' });
});

module.exports = router;