import axios from 'axios';
import { getAuthToken } from '../../lib/auth';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export const sendMessage = async (payload) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Token not found');
  }
  try {
    const response = await axios.post(`${API_BASE}/chatbot/api/chat/`, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || '请求失败');
  }
};