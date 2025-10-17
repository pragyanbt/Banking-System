import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import { authAPI } from '../../services/api';
import { MdSecurity } from 'react-icons/md';
import './Auth.css';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    
    try {
      const response = await authAPI.login(credentials);
      dispatch(loginSuccess({
        user: {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          roles: response.data.roles,
        },
        token: response.data.token,
      }));
      navigate('/dashboard');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card boa-card">
        <div className="auth-header-compact">
          <div className="boa-logo" style={{ marginBottom: '20px', textAlign: 'center' }}>
            <img src="/logo.svg" alt="Pragyan Bank of USA" style={{ height: '90px' }} />
          </div>
          <h2 className="auth-page-title">Sign In</h2>
        </div>
        
        <div className="auth-card-body boa-card-body">
          <form onSubmit={handleSubmit} className="auth-form boa-form">
            <div className="boa-form-group">
              <label className="boa-label">Online ID</label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter your Online ID"
                className="boa-input"
                required
              />
            </div>
            
            <div className="boa-form-group">
              <label className="boa-label">Passcode</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your passcode"
                className="boa-input"
                required
              />
            </div>
            
            <div className="boa-form-group">
              <label className="boa-label">
                <input type="checkbox" /> Remember my Online ID
              </label>
            </div>
            
            {error && (
              <div className="boa-alert boa-alert-error">
                <span>⚠️</span>
                {error}
              </div>
            )}
            
            <button type="submit" className="boa-button boa-button-large" disabled={loading}>
              {loading ? (
                <>
                  <span className="boa-loading"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
            
            <div className="auth-links">
              <a href="#" className="auth-link">Forgot ID/Passcode?</a>
              <a href="#" className="auth-link">Enroll in Online Banking</a>
            </div>
          </form>
          
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup" className="auth-link">Open an account</Link></p>
            <div className="auth-security">
              <p>
                <MdSecurity style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Your information is protected with bank-grade security
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

