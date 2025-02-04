require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const musicRoutes = require('./routes/musicRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authMiddleware = require('./middleware/auth');  

const app = express();
app.use(bodyParser.json());
const path = require('path');
app.use('/public/uploads', express.static('public/uploads'));

connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes); 
app.use('/api/music', musicRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/messages', messageRoutes); 


const PORT = process.env.PORT || 8006;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
