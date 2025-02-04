import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8006/', 
  timeout: 10000,
});

// Register a user
export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post('/api/auth/register', { username, email, password });
    return response.data; 
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

// Log in a user
export const loginUser = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      console.log('Login response in API:', response); 
      return response.data;  
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
    return response.data;  
  } catch (error) {
    console.error('Error uploading music:', error);
    throw error;
  }
};

