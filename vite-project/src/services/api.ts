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

  // Utility to build headers safely
  private buildHeaders(requireAuth: boolean): Headers {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    if (requireAuth && this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }
    return headers;
  }

  // Generic request method that can skip auth for public endpoints
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {},
    requireAuth = true
  ) {
    const headers = this.buildHeaders(requireAuth);

    // If options.headers exists, merge them in
    if (options.headers) {
      // If it's a Headers instance
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => headers.set(key, value));
      }
      // If it's an array of tuples
      else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => headers.set(key, value));
      }
      // If it's a plain object
      else {
        Object.entries(options.headers as Record<string, string>).forEach(
          ([key, value]) => headers.set(key, value)
        );
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401 && requireAuth) {
        this.clearToken();
        throw new Error('Authentication required');
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // PUBLIC: Get all public events (no auth required)
  async getPublicEvents() {
    return this.makeRequest('/api/public-events', {}, false);
  }

  // Auth methods
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

  // UFC Prediction methods (require auth)
  async getPrediction(fighter1: string, fighter2: string, eventDate: string, referee: string) {
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

  async getFighterInfo(fighterName: string) {
    return this.makeRequest(`/api/predictions/fighter/${encodeURIComponent(fighterName)}`);
  }

  async getModelStatus() {
    return this.makeRequest('/api/predictions/models/status');
  }

  // Event management methods (require auth)
  async getEvents() {
    return this.makeRequest('/api/events');
  }

  async createEvent(name: string, date: string, location: string = '') {
    return this.makeRequest('/api/events', {
      method: 'POST',
      body: JSON.stringify({ name, date, location }),
    });
  }

  async updateEvent(eventId: string, name: string, date: string, location: string = '') {
    return this.makeRequest(`/api/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify({ name, date, location }),
    });
  }

  async deleteEvent(eventId: string) {
    return this.makeRequest(`/api/events/${eventId}`, {
      method: 'DELETE',
    });
  }

  // Match management methods (require auth)
  async createMatch(eventId: string, matchData: {
    fighter1: string;
    fighter2: string;
    odds1: string;
    odds2: string;
    referee: string;
    weightclass?: string;
    event_date: string;
    prediction_data?: any;
  }) {
    return this.makeRequest(`/api/events/${eventId}/matches`, {
      method: 'POST',
      body: JSON.stringify(matchData),
    });
  }

  async deleteMatch(matchId: string) {
    return this.makeRequest(`/api/matches/${matchId}`, {
      method: 'DELETE',
    });
  }

  // Match result update (require auth)
  async updateMatchResult(matchId: string, result: "pending" | "hit" | "miss") {
    return this.makeRequest(`/api/matches/${matchId}`, {
      method: 'PUT',
      body: JSON.stringify({ result }),
    });
  }
}

export const apiService = new ApiService();
