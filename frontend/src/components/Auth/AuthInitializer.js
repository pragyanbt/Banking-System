import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth, setLoading, logout } from '../../store/authSlice';
import { authAPI } from '../../services/api';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { token, user, loading } = useSelector(state => state.auth);

  useEffect(() => {
    const initializeAuthState = async () => {
      const storedToken = localStorage.getItem('token');
      
      // If we have a token but no user data, fetch user data
      if (storedToken && !user) {
        console.log('Initializing auth with stored token...');
        dispatch(setLoading(true));
        
        try {
          // Fetch user data using the stored token
          const response = await authAPI.getCurrentUser();
          console.log('User data fetched:', response.data);
          
          if (response.data) {
            dispatch(initializeAuth({
              user: response.data,
              token: storedToken
            }));
            console.log('Auth initialized successfully');
          } else {
            console.log('No user data received, logging out');
            dispatch(logout());
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          // Token is invalid or expired, clear it
          dispatch(logout());
        }
      } else if (!storedToken && user) {
        // No token but user exists, clear user
        console.log('No token found, clearing user data');
        dispatch(logout());
      }
    };

    initializeAuthState();
  }, [dispatch, user]);

  // Show loading spinner while initializing
  if (loading && localStorage.getItem('token') && !user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: 'var(--boa-primary)'
      }}>
        Loading...
      </div>
    );
  }

  return children;
};

export default AuthInitializer;
