import axios from 'axios';

// Environment-based base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://audly.onrender.com/', // Use environment variable for base URL
  // baseURL: process.env.REACT_APP_API_BASE_URL || 'http://10.0.2.2:8005', // Use environment variable for base URL

  timeout: 10000,
});

// Register a user
export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post('/api/auth/register', { username, email, password });
    return response.data;  // Assuming response has the data directly
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

// Log in a user
export const loginUser = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      console.log('Login response in API:', response); // Debugging log
      return response.data;  // Assuming response contains token or user data
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

// Upload music
export const uploadMusic = async (token, file, title, artist) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('artist', artist);

  try {
    const response = await api.post('/api/music/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;  // Assuming response contains the uploaded music data
  } catch (error) {
    console.error('Error uploading music:', error);
    throw error;
  }
};

