// API Configuration for remote connections
// Automatically detects server URL based on environment

const getServerUrl = () => {
  // Check if running on localhost
  if (window.location.hostname === 'goalguessapi-8g12q0bk.b4a.run/') {
    return 'https://goalguessapi-8g12q0bk.b4a.run/';
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
