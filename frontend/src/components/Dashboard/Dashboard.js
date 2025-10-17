import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { accountAPI } from '../../services/api';
import { MdAccountBalance, MdAttachMoney, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import Sidebar from '../Sidebar/Sidebar';
import './Dashboard.css';

function Dashboard() {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      if (user?.id) {
        const response = await accountAPI.getAccountsByUser(user.id);
        setAccounts(response.data);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalBalance = () => {
    return accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
  };

  return (
    <div>
      <div className="boa-page-header">
        <h1 className="boa-page-title">Welcome back, {user?.firstName || user?.username}!</h1>
        <p className="boa-page-subtitle">Here's your account overview</p>
      </div>

      <div className="boa-dashboard-grid boa-dashboard-grid-2">
        <div className="boa-stat-card">
          <div className="boa-stat-header">
            <div className="boa-stat-icon">
              <MdAttachMoney />
            </div>
          </div>
          <h2 className="boa-stat-value">${calculateTotalBalance().toFixed(2)}</h2>
          <p className="boa-stat-label">Total Balance</p>
        </div>

        <div className="boa-stat-card">
          <div className="boa-stat-header">
            <div className="boa-stat-icon">
              <MdAccountBalance />
            </div>
          </div>
          <h2 className="boa-stat-value">{accounts.length}</h2>
          <p className="boa-stat-label">Active Accounts</p>
        </div>
      </div>

      <div className="boa-card boa-fade-in">
        <div className="boa-card-header">
          <h3>Your Accounts</h3>
          <div className="boa-card-header-actions">
            <button className="boa-button boa-button-outline" onClick={() => navigate('/accounts')}>
              Manage Accounts
            </button>
          </div>
        </div>
        <div className="boa-card-body">
          {loading ? (
            <div className="boa-loading-overlay">
              <div className="boa-loading-spinner"></div>
            </div>
          ) : accounts.length > 0 ? (
            <div className="boa-dashboard-grid boa-dashboard-grid-2">
              {accounts.map((account, index) => (
                <div key={account.id} className="boa-account-card boa-slide-in-left" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="boa-account-header">
                    <div className="boa-account-type">
                      <h4>{account.accountType}</h4>
                      <span className={`boa-status-${account.isActive ? 'active' : 'inactive'}`}>
                        {account.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="boa-account-icon">
                      <MdAccountBalance />
                    </div>
                  </div>
                  <div className="boa-account-details">
                    <p className="boa-account-number">****{account.accountNumber.slice(-4)}</p>
                    <h2 className="boa-account-balance">${parseFloat(account.balance || 0).toFixed(2)}</h2>
                  </div>
                  <div className="boa-account-actions">
                    <button 
                      className="boa-button boa-button-secondary"
                      onClick={() => navigate('/transactions')}
                    >
                      View Transactions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="boa-empty-state">
              <div className="boa-empty-icon">
                <MdAccountBalance />
              </div>
              <h3>No Accounts Yet</h3>
              <p>Get started by opening your first account</p>
              <button 
                className="boa-button"
                onClick={() => navigate('/accounts')}
              >
                Open New Account
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;

