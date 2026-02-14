// API Configuration for remote connections
// Automatically detects server URL based on environment

// src/config/api.js

export const API_BASE = window.location.hostname.includes('localhost')
  ? 'http://localhost:5000/api' // dev backend
  : 'https://goalguess-backend.onrender.com/api'; // production backend

const LOCAL_BACKEND = 'http://localhost:5000';
const PROD_BACKEND = 'https://goalguess-backend.onrender.com'; // your Render backend URL

const getBackendUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return LOCAL_BACKEND;
  }
  return PROD_BACKEND;
};

export const API_URL = getBackendUrl();
export const SOCKET_URL = getBackendUrl();

console.log('API URL:', API_URL);
console.log('Socket URL:', SOCKET_URL);


