import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { accountAPI } from '../../services/api';
import { MdAccountBalance, MdAssignment, MdCheckCircle, MdPending, MdCancel, MdVisibility, MdVisibilityOff, MdContentCopy } from 'react-icons/md';
import '../Dashboard/Dashboard.css';

function Accounts() {
  const { user } = useSelector(state => state.auth);
  const [accounts, setAccounts] = useState([]);
  const [accountApplications, setAccountApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAccountNumbers, setShowAccountNumbers] = useState({});
  const [activeTab, setActiveTab] = useState('active');
  const [formData, setFormData] = useState({
    userId: user?.id,
    accountType: 'SAVINGS',
    initialDeposit: '',
    currency: 'USD',
    purpose: '',
    employmentStatus: '',
    monthlyIncome: '',
    address: '',
    phoneNumber: ''
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Account number copied to clipboard! ✅');
  };

  const toggleAccountNumber = (accountId) => {
    setShowAccountNumbers(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  useEffect(() => {
    if (user?.id) {
      loadAccounts();
      loadAccountApplications();
      setFormData(prev => ({ ...prev, userId: user.id }));
    }
  }, [user]);


  const loadAccounts = async () => {
    try {
      const response = await accountAPI.getAccountsByUser(user.id);
      setAccounts(response.data);
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const loadAccountApplications = async () => {
    try {
      const response = await accountAPI.getApplicationsByUser(user.id);
      console.log('Account applications API response:', response.data);
      
      // Ensure we have valid data and add default values for missing fields
      const applications = (response.data || []).map(app => ({
        ...app,
        applicationStatus: app.applicationStatus || 'PENDING',
        accountType: app.accountType || 'SAVINGS',
        initialDeposit: app.initialDeposit || 0,
        createdAt: app.createdAt || new Date().toISOString()
      }));
      
      setAccountApplications(applications);
    } catch (error) {
      console.error('Error loading account applications:', error);
      setAccountApplications([]); // Ensure empty array on error
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      alert('User not authenticated. Please login again.');
      return;
    }
    
    try {
      // Validate required fields
      if (!formData.initialDeposit || !formData.monthlyIncome || !formData.purpose || 
          !formData.employmentStatus || !formData.address || !formData.phoneNumber) {
        alert('Please fill in all required fields.');
        return;
      }

      const applicationData = {
        ...formData,
        userId: user.id,
        initialDeposit: parseFloat(formData.initialDeposit),
        monthlyIncome: parseFloat(formData.monthlyIncome)
      };

      console.log('Submitting application data:', applicationData);
      const response = await accountAPI.submitApplication(applicationData);
      console.log('Application submitted successfully:', response.data);
      
      setShowModal(false);
      setFormData({ 
        userId: user.id,
        accountType: 'SAVINGS',
        initialDeposit: '',
        currency: 'USD',
        purpose: '',
        employmentStatus: '',
        monthlyIncome: '',
        address: '',
        phoneNumber: ''
      });

      alert(`Account application submitted successfully! Application Number: ${response.data.applicationNumber}`);
      loadAccountApplications(); // Reload applications to show the new one
    } catch (error) {
      console.error('Error submitting account application:', error);
      alert(error.response?.data?.message || 'Error submitting account application');
    }
  };

  return (
    <div>
      <div className="boa-page-header">
        <h1 className="boa-page-title">
          <MdAccountBalance style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          My Accounts
        </h1>
        <p className="boa-page-subtitle">Manage your accounts and view application status</p>
        <div className="boa-page-actions">
          <button className="boa-button" onClick={() => setShowModal(true)}>
            + Apply for New Account
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="boa-card" style={{ marginBottom: '24px' }}>
        <div className="boa-tabs">
          <button
            className={`boa-tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Accounts ({accounts.length})
          </button>
          <button
            className={`boa-tab ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            Account Applications ({accountApplications.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'active' && (
        <div>
          {accounts.length > 0 ? (
            <div className="boa-card">
              <div className="boa-card-body">
                <div className="boa-dashboard-grid boa-dashboard-grid-2">
                  {accounts.map(account => (
                    <div key={account.id} className="boa-account-card">
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
                        <div style={{ marginBottom: '12px' }}>
                          <p style={{ fontSize: '12px', color: 'var(--boa-gray-600)', marginBottom: '4px' }}>
                            Account Number
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="boa-account-number" style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: '600' }}>
                              {showAccountNumbers[account.id] ? account.accountNumber : `****${account.accountNumber.slice(-4)}`}
                            </span>
                            <button 
                              onClick={() => toggleAccountNumber(account.id)}
                              style={{ 
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '18px',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                opacity: '0.7',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.opacity = '1'}
                              onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                              title={showAccountNumbers[account.id] ? 'Hide account number' : 'Show account number'}
                            >
                              {showAccountNumbers[account.id] ? <MdVisibilityOff /> : <MdVisibility />}
                            </button>
                            <button 
                              onClick={() => copyToClipboard(account.accountNumber)}
                              style={{ 
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '18px',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                opacity: '0.7',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.opacity = '1'}
                              onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                              title="Copy account number"
                            >
                              <MdContentCopy />
                            </button>
                          </div>
                        </div>
                        <h2 className="boa-account-balance">${parseFloat(account.balance).toFixed(2)}</h2>
                        <p style={{color: 'var(--boa-gray-600)', fontSize: '12px'}}>
                          {account.currency}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="boa-empty-state">
              <div className="boa-empty-icon">
                <MdAccountBalance style={{ fontSize: '48px', color: 'var(--boa-gray-400)' }} />
              </div>
              <h3>No Active Accounts</h3>
              <p>Apply for your first account to get started</p>
              <button className="boa-button" onClick={() => setShowModal(true)}>
                Apply for Account
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div>
          {accountApplications.length > 0 ? (
            <div className="boa-card">
              <div className="boa-card-body">
                <div className="boa-dashboard-grid boa-dashboard-grid-2">
                  {accountApplications.map(app => (
                    <div key={app.id} className="boa-account-card">
                      <div className="boa-account-header">
                        <div className="boa-account-type">
                          <h4>{app.accountType || 'SAVINGS'}</h4>
                          <span className={`boa-status-${(app.applicationStatus || 'PENDING').toLowerCase()}`}>
                            {app.applicationStatus === 'PENDING' && <MdPending style={{ marginRight: '4px' }} />}
                            {app.applicationStatus === 'APPROVED' && <MdCheckCircle style={{ marginRight: '4px' }} />}
                            {app.applicationStatus === 'REJECTED' && <MdCancel style={{ marginRight: '4px' }} />}
                            {app.applicationStatus || 'PENDING'}
                          </span>
                        </div>
                        <div className="boa-account-icon">
                          <MdAccountBalance />
                        </div>
                      </div>
                      <div className="boa-account-details">
                        <div className="boa-account-info">
                          <span className="boa-label">Application #:</span>
                          <span className="boa-value">{app.applicationNumber}</span>
                        </div>
                        <div className="boa-account-info">
                          <span className="boa-label">Initial Deposit:</span>
                          <span className="boa-value">${(app.initialDeposit || 0).toLocaleString()}</span>
                        </div>
                        <div className="boa-account-info">
                          <span className="boa-label">Submitted:</span>
                          <span className="boa-value">{new Date(app.createdAt || new Date()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="boa-empty-state">
              <div className="boa-empty-icon">
                <MdAssignment style={{ fontSize: '48px', color: 'var(--boa-gray-400)' }} />
              </div>
              <h3>No Applications Yet</h3>
              <p>Submit your first account application</p>
              <button className="boa-button" onClick={() => setShowModal(true)}>
                Apply for Account
              </button>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="boa-modal" onClick={() => setShowModal(false)}>
          <div className="boa-modal-content" onClick={e => e.stopPropagation()}>
            <div className="boa-modal-header">
              <h2 className="boa-modal-title">Apply for New Account</h2>
            </div>
            <form onSubmit={handleSubmit} className="boa-form">
              <div className="boa-form-group">
                <label className="boa-label">Account Type</label>
                <select
                  className="boa-input"
                  value={formData.accountType}
                  onChange={e => setFormData({...formData, accountType: e.target.value})}
                >
                  <option value="SAVINGS">Savings Account</option>
                  <option value="CHECKING">Checking Account</option>
                  <option value="FIXED_DEPOSIT">Fixed Deposit</option>
                  <option value="CURRENT">Current Account</option>
                </select>
              </div>
              
              <div className="boa-form-group">
                <label className="boa-label">Initial Deposit</label>
                <input
                  type="number"
                  step="0.01"
                  className="boa-input"
                  value={formData.initialDeposit}
                  onChange={e => setFormData({...formData, initialDeposit: e.target.value})}
                  placeholder="Enter initial deposit amount"
                  required
                />
              </div>

              <div className="boa-form-group">
                <label className="boa-label">Purpose of Account</label>
                <select
                  className="boa-input"
                  value={formData.purpose}
                  onChange={e => setFormData({...formData, purpose: e.target.value})}
                  required
                >
                  <option value="">Select purpose</option>
                  <option value="PERSONAL">Personal Banking</option>
                  <option value="BUSINESS">Business Banking</option>
                  <option value="INVESTMENT">Investment</option>
                  <option value="EDUCATION">Education Savings</option>
                  <option value="EMERGENCY">Emergency Fund</option>
                </select>
              </div>

              <div className="boa-form-group">
                <label className="boa-label">Employment Status</label>
                <select
                  className="boa-input"
                  value={formData.employmentStatus}
                  onChange={e => setFormData({...formData, employmentStatus: e.target.value})}
                  required
                >
                  <option value="">Select employment status</option>
                  <option value="EMPLOYED">Employed</option>
                  <option value="SELF_EMPLOYED">Self-Employed</option>
                  <option value="STUDENT">Student</option>
                  <option value="RETIRED">Retired</option>
                  <option value="UNEMPLOYED">Unemployed</option>
                </select>
              </div>

              <div className="boa-form-group">
                <label className="boa-label">Monthly Income</label>
                <input
                  type="number"
                  step="0.01"
                  className="boa-input"
                  value={formData.monthlyIncome}
                  onChange={e => setFormData({...formData, monthlyIncome: e.target.value})}
                  placeholder="Enter monthly income"
                  required
                />
              </div>

              <div className="boa-form-group">
                <label className="boa-label">Address</label>
                <textarea
                  className="boa-input"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder="Enter your full address"
                  rows="3"
                  required
                />
              </div>

              <div className="boa-form-group">
                <label className="boa-label">Phone Number</label>
                <input
                  type="tel"
                  className="boa-input"
                  value={formData.phoneNumber}
                  onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
                <button type="button" className="boa-button boa-button-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="boa-button">Send Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Accounts;