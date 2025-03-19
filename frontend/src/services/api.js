import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('Token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('认证失效，请重新登录');
          break;
        case 403:
          console.error('权限不足');
          break;
        case 404:
          console.error('资源不存在');
          break;
        default:
          console.error(`服务器错误: ${error.response.status}`);
      }
    } else {
      console.error('网络连接异常');
    }
    return Promise.reject(error);
  }
);



export default api;