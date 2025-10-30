import axios from 'axios';

// Update this to your Flask server IP address when testing on physical device
// For iOS simulator use: http://localhost:8000
// For Android emulator use: http://10.0.2.2:8000
// For physical device use: http://YOUR_COMPUTER_IP:8000
// Set via EXPO_PUBLIC_API_BASE_URL in .env file
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pestAPI = {
  // Get all pests
  getAllPests: async () => {
    try {
      const response = await api.get('/pests');
      // Since Flask returns HTML, we'll need to parse or create a dedicated API endpoint
      // For now, we'll use the known pest data
      return {
        success: true,
        data: [],
      };
    } catch (error) {
      console.error('Error fetching pests:', error);
      return { success: false, error: error.message };
    }
  },

  // Classify pest image
  classifyPest: async (imageUri) => {
    try {
      const formData = new FormData();
      
      // Extract filename from URI
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('file', {
        uri: imageUri,
        name: filename,
        type: type,
      });

      const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error classifying pest:', error);
      return { success: false, error: error.message };
    }
  },

  // Search for custom pest
  searchPest: async (query) => {
    try {
      const response = await api.post('/search_pest', { query });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error searching pest:', error);
      return { success: false, error: error.message };
    }
  },

  // Get pest details
  getPestDetails: async (pestName) => {
    try {
      const response = await api.get(`/pest/${pestName}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching pest details:', error);
      return { success: false, error: error.message };
    }
  },
};

export default api;

