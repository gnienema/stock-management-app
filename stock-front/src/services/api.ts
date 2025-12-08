// src/services/api.ts
import axios from 'axios';

// Utilise la variable d'environnement en production, ou localhost en développement
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;