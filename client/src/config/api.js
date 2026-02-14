// API Configuration for remote connections
// Automatically detects server URL based on environment

// Replace with your Render backend URL
const BACKEND_URL = 'https://goalguess-backend.onrender.com';

const getServerUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000'; // local dev
  }
  return BACKEND_URL; // production
};

export const API_URL = getServerUrl();
export const SOCKET_URL = getServerUrl();

console.log('API URL:', API_URL);
console.log('Socket URL:', SOCKET_URL);

