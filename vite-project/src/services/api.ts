// services/api.ts
import type { BackendPredictionResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        throw new Error('Authentication required');
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async login(username: string, password: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.setToken(data.access_token);
    return data;
  }

  async getPrediction(fighter1: string, fighter2: string, eventDate: string, referee: string): Promise<BackendPredictionResponse> {
    return this.makeRequest('/api/predictions/predict-with-shap', {
      method: 'POST',
      body: JSON.stringify({
        fighter_1: fighter1,
        fighter_2: fighter2,
        event_date: eventDate,
        referee: referee,
        prediction_type: 'method',
      }),
    });
  }

  async searchFighters(query: string) {
    return this.makeRequest(`/api/predictions/fighters/search?query=${encodeURIComponent(query)}&limit=10`);
  }

  async getReferees() {
    return this.makeRequest('/api/predictions/referees');
  }

  async updateMatchResult(matchId: string, result: "pending" | "hit" | "miss") {
    return this.makeRequest('/api/predictions/match-result', {
      method: 'POST',
      body: JSON.stringify({
        match_id: matchId,
        result: result,
      }),
    });
  }
}

export const apiService = new ApiService();
