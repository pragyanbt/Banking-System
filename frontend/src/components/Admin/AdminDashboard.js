import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { creditCardAPI, loanAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { MdDashboard, MdCreditCard, MdAttachMoney, MdTrendingUp, MdCheckCircle, MdCancel, MdPending } from 'react-icons/md';
import '../Dashboard/Dashboard.css';

function AdminDashboard() {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingCreditCards: 0,
    pendingLoans: 0,
    approvedCreditCards: 0,
    approvedLoans: 0,
    rejectedCreditCards: 0,
    rejectedLoans: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    // Check if user is admin
    const hasAdminRole = user?.roles?.some(role => 
      role.name === 'ROLE_ADMIN' || role === 'ROLE_ADMIN' || role === 'admin'
    );
    
    if (!hasAdminRole) {
      alert('Access denied. Admin privileges required.');
      navigate('/dashboard');
      return;
    }

    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      // This would ideally be a dedicated admin stats endpoint
      // For now, we'll show a welcome message
      setStats({
        pendingCreditCards: '?',
        pendingLoans: '?',
        approvedCreditCards: '?',
        approvedLoans: '?',
        rejectedCreditCards: '?',
        rejectedLoans: '?'
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  return (
    <div>
      <div className="boa-page-header">
        <h1 className="boa-page-title">Admin Dashboard</h1>
        <p className="boa-page-subtitle">Review and manage customer applications</p>
      </div>

      {/* Stats Grid */}
      <div className="boa-dashboard-grid boa-dashboard-grid-3">
        <div className="boa-stat-card" style={{ background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <div className="boa-stat-icon">
            <MdPending style={{ fontSize: '32px', color: '#f59e0b' }} />
          </div>
          <div className="boa-stat-content">
            <h3 className="boa-stat-value">{stats.pendingCreditCards}</h3>
            <p className="boa-stat-label">Pending Credit Cards</p>
          </div>
        </div>

        <div className="boa-stat-card" style={{ background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <div className="boa-stat-icon">
            <MdPending style={{ fontSize: '32px', color: '#f59e0b' }} />
          </div>
          <div className="boa-stat-content">
            <h3 className="boa-stat-value">{stats.pendingLoans}</h3>
            <p className="boa-stat-label">Pending Loans</p>
          </div>
        </div>

        <div className="boa-stat-card" style={{ background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <div className="boa-stat-icon">
            <MdCheckCircle style={{ fontSize: '32px', color: '#10b981' }} />
          </div>
          <div className="boa-stat-content">
            <h3 className="boa-stat-value">{stats.approvedCreditCards}</h3>
            <p className="boa-stat-label">Approved Credit Cards</p>
          </div>
        </div>

        <div className="boa-stat-card" style={{ background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <div className="boa-stat-icon">
            <MdCheckCircle style={{ fontSize: '32px', color: '#10b981' }} />
          </div>
          <div className="boa-stat-content">
            <h3 className="boa-stat-value">{stats.approvedLoans}</h3>
            <p className="boa-stat-label">Approved Loans</p>
          </div>
        </div>

        <div className="boa-stat-card" style={{ background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <div className="boa-stat-icon">
            <MdCancel style={{ fontSize: '32px', color: '#ef4444' }} />
          </div>
          <div className="boa-stat-content">
            <h3 className="boa-stat-value">{stats.rejectedCreditCards}</h3>
            <p className="boa-stat-label">Rejected Credit Cards</p>
          </div>
        </div>

        <div className="boa-stat-card" style={{ background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <div className="boa-stat-icon">
            <MdCancel style={{ fontSize: '32px', color: '#ef4444' }} />
          </div>
          <div className="boa-stat-content">
            <h3 className="boa-stat-value">{stats.rejectedLoans}</h3>
            <p className="boa-stat-label">Rejected Loans</p>
          </div>
        </div>
      </div>


      {/* Welcome Message */}
      <div className="boa-card" style={{ marginTop: '24px', background: 'linear-gradient(135deg, rgba(227, 24, 55, 0.08) 0%, rgba(0, 59, 125, 0.08) 100%)', border: '1px solid rgba(227, 24, 55, 0.2)' }}>
        <div className="boa-card-body" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--boa-red) 0%, var(--boa-blue) 100%)', 
              borderRadius: '50%', 
              width: '60px', 
              height: '60px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '20px',
              boxShadow: '0 8px 25px rgba(227, 24, 55, 0.3)'
            }}>
              <MdDashboard style={{ fontSize: '28px', color: 'white' }} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px', color: 'var(--boa-red)', fontSize: '24px', fontWeight: '600' }}>
                Welcome, Administrator!
              </h3>
              <p style={{ margin: '0', color: 'var(--boa-gray-600)', fontSize: '14px' }}>
                System Access Level: Full Administrative Privileges
              </p>
            </div>
          </div>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.7)', 
            borderRadius: '12px', 
            padding: '20px',
            border: '1px solid rgba(227, 24, 55, 0.1)'
          }}>
            <p style={{ margin: '0 0 16px', color: 'var(--boa-gray-700)', lineHeight: '1.6' }}>
              You have full access to review and manage customer applications. Navigate to the sidebar to access:
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px' }}>
                <MdCreditCard style={{ fontSize: '20px', color: '#667eea', marginRight: '12px' }} />
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--boa-gray-700)' }}>
                  Credit Card Reviews
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'rgba(240, 147, 251, 0.1)', borderRadius: '8px' }}>
                <MdAttachMoney style={{ fontSize: '20px', color: '#f093fb', marginRight: '12px' }} />
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--boa-gray-700)' }}>
                  Loan Applications
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'rgba(67, 233, 123, 0.1)', borderRadius: '8px' }}>
                <MdTrendingUp style={{ fontSize: '20px', color: '#43e97b', marginRight: '12px' }} />
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--boa-gray-700)' }}>
                  Application Analytics
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

