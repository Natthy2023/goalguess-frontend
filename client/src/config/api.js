// API Configuration for remote connections
// Automatically detects server URL based on environment

const getServerUrl = () => {
  // Check if running on localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // For remote connections via IP or domain
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  const host = window.location.hostname;
  const port = 5000;
  
  return `${protocol}://${host}:${port}`;
};

export const API_URL = getServerUrl();
export const SOCKET_URL = getServerUrl();

console.log('API URL:', API_URL);
console.log('Socket URL:', SOCKET_URL);
