const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  async query(question, category = 'general', targetLanguage = null, signal = null, sessionId = null, webSearchMode = false) {
    try {
      // Create AbortController with timeout for complex queries (60 seconds)
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => timeoutController.abort(), 60000); // 60s timeout

      // Combine user's abort signal with timeout signal
      const combinedSignal = signal || timeoutController.signal;
      if (signal) {
        // If user signal exists, abort timeout when user cancels
        signal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
        });
      }

      const response = await fetch(`${API_BASE_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          category,
          target_language: targetLanguage,
          session_id: sessionId, // Include session_id for conversation memory
          web_search_mode: webSearchMode, // Include web search mode
        }),
        signal: combinedSignal, // Pass combined abort signal
      });

      clearTimeout(timeoutId); // Clear timeout if request completes

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        console.log('Request was aborted or timed out');
        throw new Error('Request cancelled or timed out');
      }
      console.error('Query error:', error);
      throw error;
    }
  }

  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Stats error:', error);
      throw error;
    }
  }

  async getExamples() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/examples`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Examples error:', error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Logout error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async register(username, password, email) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Registration failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
}

export default new ApiClient();

