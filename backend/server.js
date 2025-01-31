require('dotenv').config();
// console.log(process.env.JWT_SECRET); // To ensure JWT_SECRET is being loaded
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const musicRoutes = require('./routes/musicRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/auth');  // Adjust the path as needed

const app = express();
app.use(bodyParser.json());
const path = require('path');

connectDB();
// Use CORS middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes); 
app.use('/api/music', musicRoutes); 
app.use('/api/users', userRoutes); 
// app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
// app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 8006;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
