import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      {/* Animated background grid */}
      {Array.from({ length: 150 }).map((_, i) => (
        <span key={i} className="grid-span"></span>
      ))}

      <div className="signin">
        <div className="content">
          <h2>LAW-GPT</h2>
          <p className="subtitle">Sign In to Access Legal AI</p>
          <form className="form" onSubmit={handleSubmit}>
            <div className="inputBox">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
              <i>Username</i>
            </div>
            <div className="inputBox">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <i>Password</i>
            </div>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            <div className="links">
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Forgot password feature coming soon'); }}>
                Forgot Password
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Signup feature coming soon'); }}>
                Signup
              </a>
            </div>
            <div className="inputBox">
              <input
                type="submit"
                value={loading ? 'Logging in...' : 'Login'}
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;

