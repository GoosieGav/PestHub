import axios from 'axios';

// For iOS simulator use: http://localhost:8000
// For Android emulator use: http://10.0.2.2:8000
// For physical device use: http://YOUR_COMPUTER_IP:8000
// Set via EXPO_PUBLIC_API_BASE_URL in .env file
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pestAPI = {
  // Classify pest image — throws on error
  classifyPest: async (imageUri) => {
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('file', { uri: imageUri, name: filename, type });

    const response = await api.post('/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Search for a pest by name — throws on error
  searchPest: async (query) => {
    const response = await api.post('/search_pest', { query });
    return response.data;
  },
};

export default api;
