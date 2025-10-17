import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { accountAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdAccountBalance, MdAssignment } from 'react-icons/md';
import '../Dashboard/Dashboard.css';

function AccountReview() {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('PENDING');

  const [reviewForm, setReviewForm] = useState({
    status: 'APPROVED',
    rejectionReason: '',
    reviewedBy: user?.username || 'admin'
  });

  useEffect(() => {
    const hasAdminRole = user?.roles?.some(role =>
      role.name === 'ROLE_ADMIN' || role === 'ROLE_ADMIN' || role === 'admin'
    );

    if (!hasAdminRole) {
      alert('Access denied. Admin privileges required.');
      navigate('/dashboard');
      return;
    }

    loadApplications();
  }, [user, navigate]);

  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFilteredApps(applications);
    } else {
      setFilteredApps(applications.filter(app => app.applicationStatus === statusFilter));
    }
  }, [applications, statusFilter]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      // Load all applications regardless of status
      const response = await accountAPI.getApplicationsByStatus('ALL');
      setApplications(response.data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (app) => {
    setSelectedApp(app);
    setReviewForm({
      status: app.applicationStatus === 'REJECTED' ? 'REJECTED' : 'APPROVED',
      rejectionReason: app.rejectionReason || '',
      reviewedBy: user?.username || 'admin'
    });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const dataToSend = {
        applicationNumber: selectedApp.applicationNumber,
        status: reviewForm.status,
        rejectionReason: reviewForm.status === 'REJECTED' ? reviewForm.rejectionReason : null,
        reviewedBy: reviewForm.reviewedBy
      };

      await axios.put('http://localhost:8082/api/accounts/applications/review', dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert(`Application ${reviewForm.status.toLowerCase()} successfully!`);
      setShowReviewModal(false);
      loadApplications();
    } catch (error) {
      console.error('Error reviewing application:', error);
      alert(error.response?.data?.message || 'Error reviewing application');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (application) => {
    if (!application) return;

    try {
      setLoading(true);

      const token = localStorage.getItem('token');

      await axios.post(`http://localhost:8082/api/accounts/applications/${application.applicationNumber}/create-account`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setApplications(prev => prev.map(app =>
        app.applicationNumber === application.applicationNumber
          ? { ...app, accountCreated: true, accountCreatedAt: new Date().toISOString() }
          : app
      ));

      alert(`Account created successfully for application ${application.applicationNumber}!`);
      loadApplications(); // Reload to update status
    } catch (error) {
      console.error('Failed to create account:', error);
      alert('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleConvertAllApproved = async () => {
    if (!window.confirm('This will convert all approved applications to accounts. Continue?')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.post('http://localhost:8082/api/accounts/applications/convert-approved-to-accounts', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert(response.data);
      loadApplications(); // Reload to update status
    } catch (error) {
      console.error('Failed to convert applications:', error);
      alert('Failed to convert applications: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'PENDING': 'warning',
      'APPROVED': 'success',
      'REJECTED': 'danger',
      'UNDER_REVIEW': 'info'
    };
    return `boa-status-${statusColors[status] || 'secondary'}`;
  };

  return (
    <div>
      <div className="boa-page-header">
        <h1 className="boa-page-title">
          <MdAccountBalance style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Account Application Review
        </h1>
        <p className="boa-page-subtitle">Review and approve/reject customer account applications</p>
        <div className="boa-page-actions">
          <button 
            className="boa-button boa-button-secondary" 
            onClick={handleConvertAllApproved}
            disabled={loading}
            title="Convert all approved applications to accounts"
          >
            Convert All Approved to Accounts
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="boa-card" style={{ marginBottom: '24px' }}>
        <div className="boa-tabs">
          <button
            className={`boa-tab ${statusFilter === 'PENDING' ? 'active' : ''}`}
            onClick={() => setStatusFilter('PENDING')}
          >
            Pending ({applications.filter(a => a.applicationStatus === 'PENDING').length})
          </button>
          <button
            className={`boa-tab ${statusFilter === 'APPROVED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('APPROVED')}
          >
            Approved ({applications.filter(a => a.applicationStatus === 'APPROVED').length})
          </button>
          <button
            className={`boa-tab ${statusFilter === 'REJECTED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('REJECTED')}
          >
            Rejected ({applications.filter(a => a.applicationStatus === 'REJECTED').length})
          </button>
          <button
            className={`boa-tab ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            All ({applications.length})
          </button>
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <p>Loading applications...</p>
      ) : filteredApps.length > 0 ? (
        <div className="boa-card">
          <div className="boa-table-container">
            <table className="boa-table">
              <thead>
                <tr>
                  <th>Application #</th>
                  <th>Applicant</th>
                  <th>Account Type</th>
                  <th>Initial Deposit</th>
                  <th>Monthly Income</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map(app => (
                  <tr key={app.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                      {app.applicationNumber}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>User ID: {app.userId}</div>
                      <div style={{ fontSize: '12px', color: 'var(--boa-gray-600)' }}>{app.phoneNumber}</div>
                    </td>
                    <td>
                      <MdAccountBalance style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      {app.accountType}
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      ${parseFloat(app.initialDeposit).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      ${parseFloat(app.monthlyIncome).toLocaleString()}
                    </td>
                    <td>
                      <span style={{ fontSize: '12px' }}>
                        {app.purpose}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadge(app.applicationStatus)}>
                        {app.applicationStatus}
                      </span>
                    </td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td>
                      {app.applicationStatus === 'PENDING' ? (
                        <button 
                          className="boa-button-small"
                          onClick={() => handleReview(app)}
                        >
                          Review
                        </button>
                      ) : app.applicationStatus === 'APPROVED' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="boa-button-small boa-button-outline"
                            onClick={() => handleReview(app)}
                          >
                            View Details
                          </button>
                          {!app.accountCreated ? (
                            <button 
                              className="boa-button-small"
                              onClick={() => handleCreateAccount(app)}
                              style={{ background: 'var(--boa-success)', color: 'black', fontWeight: '600' }}
                            >
                              Create Account
                            </button>
                          ) : (
                            <span style={{ 
                              color: 'var(--boa-success)', 
                              fontSize: '12px', 
                              fontWeight: '600',
                              padding: '4px 8px',
                              background: 'rgba(34, 197, 94, 0.1)',
                              borderRadius: '4px',
                              textAlign: 'center'
                            }}>
                              Account Created
                            </span>
                          )}
                        </div>
                      ) : (
                        <button 
                          className="boa-button-small boa-button-outline"
                          onClick={() => handleReview(app)}
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="boa-empty-state">
          <div className="boa-empty-icon">
            <MdAssignment style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          </div>
          <h3>No Applications Found</h3>
          <p>No account applications found for the selected status.</p>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="boa-modal" onClick={() => setShowReviewModal(false)}>
          <div className="boa-modal-content" onClick={e => e.stopPropagation()}>
            <div className="boa-modal-header">
              <h2 className="boa-modal-title">Review Account Application</h2>
            </div>
            <form onSubmit={handleSubmitReview} className="boa-form">
              <div className="boa-form-group">
                <label className="boa-label">Application Number</label>
                <input
                  type="text"
                  className="boa-input"
                  value={selectedApp?.applicationNumber || ''}
                  disabled
                />
              </div>

              <div className="boa-form-group">
                <label className="boa-label">Decision</label>
                <select
                  className="boa-input"
                  value={reviewForm.status}
                  onChange={(e) => setReviewForm({...reviewForm, status: e.target.value})}
                  required
                >
                  <option value="APPROVED">Approve</option>
                  <option value="REJECTED">Reject</option>
                </select>
              </div>


              {reviewForm.status === 'REJECTED' && (
                <div className="boa-form-group">
                  <label className="boa-label">Rejection Reason</label>
                  <textarea
                    className="boa-input"
                    value={reviewForm.rejectionReason}
                    onChange={(e) => setReviewForm({...reviewForm, rejectionReason: e.target.value})}
                    placeholder="Enter reason for rejection"
                    rows="3"
                    required
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="boa-button boa-button-secondary" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="boa-button" disabled={loading}>
                  {loading ? 'Processing...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountReview;