import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { MdCheckCircle, MdSecurity } from 'react-icons/md';
import './Auth.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const { confirmPassword, ...signupData } = formData;
      await authAPI.signup({ ...signupData, roles: ['customer'] });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card boa-card">
        <div className="auth-header-compact">
          <div className="boa-logo" style={{ marginBottom: '20px', textAlign: 'center' }}>
            <img src="/logo.svg" alt="Pragyan Bank of USA" style={{ height: '90px' }} />
          </div>
          <h2 className="auth-page-title">Create Account</h2>
        </div>
        
        <div className="auth-card-body boa-card-body">
          <form onSubmit={handleSubmit} className="auth-form boa-form">
            <div className="boa-form-row">
              <div className="boa-form-group">
                <label className="boa-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="boa-input"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              
              <div className="boa-form-group">
                <label className="boa-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="boa-input"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>
            
            <div className="boa-form-group">
              <label className="boa-label">Online ID</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="boa-input"
                placeholder="Choose your Online ID"
                required
              />
            </div>
            
            <div className="boa-form-group">
              <label className="boa-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="boa-input"
                placeholder="Enter your email address"
                required
              />
            </div>
            
            <div className="boa-form-group">
              <label className="boa-label">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="boa-input"
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className="boa-form-row">
              <div className="boa-form-group">
                <label className="boa-label">Passcode</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="boa-input"
                  placeholder="Create a passcode"
                  required
                  minLength="6"
                />
              </div>
              
              <div className="boa-form-group">
                <label className="boa-label">Confirm Passcode</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="boa-input"
                  placeholder="Confirm your passcode"
                  required
                />
              </div>
            </div>
            
            <div className="boa-form-group">
              <label className="boa-label">
                <input type="checkbox" required /> I agree to the Terms and Conditions and Privacy Policy
              </label>
            </div>
            
            {error && (
              <div className="boa-alert boa-alert-error">
                <span>⚠️</span>
                {error}
              </div>
            )}
            
            {success && (
              <div className="boa-alert boa-alert-success">
                <MdCheckCircle />
                {success}
              </div>
            )}
            
            <button type="submit" className="boa-button boa-button-large" disabled={loading}>
              {loading ? (
                <>
                  <span className="boa-loading"></span>
                  Creating Account...
                </>
              ) : (
                'Open Account'
              )}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
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

export default Signup;

