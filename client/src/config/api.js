// src/config/api.js

// Use environment variable for backend API
export const API_BASE = import.meta.env.VITE_API_BASE; 
export const SOCKET_URL = import.meta.env.VITE_API_BASE;

console.log('API BASE URL:', API_BASE);
console.log('Socket URL:', SOCKET_URL);
