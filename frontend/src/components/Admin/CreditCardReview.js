import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { creditCardAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdCreditCard, MdAssignment } from 'react-icons/md';
import '../Dashboard/Dashboard.css';

function CreditCardReview() {
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
    approvedCreditLimit: '',
    rejectionReason: '',
    reviewedBy: user?.username || 'admin'
  });

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

    loadApplications();
  }, [user, navigate]);

  useEffect(() => {
    // Filter applications by status
    if (statusFilter === 'ALL') {
      setFilteredApps(applications);
    } else {
      setFilteredApps(applications.filter(app => app.applicationStatus === statusFilter));
    }
  }, [applications, statusFilter]);

  const loadApplications = async () => {
    try {
      // Get all applications by status
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8083/api/credit-cards/applications/status/PENDING', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Also get APPROVED and REJECTED for admin view
      const approvedRes = await axios.get('http://localhost:8083/api/credit-cards/applications/status/APPROVED', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const rejectedRes = await axios.get('http://localhost:8083/api/credit-cards/applications/status/REJECTED', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const allApps = [...response.data, ...approvedRes.data, ...rejectedRes.data];
      setApplications(allApps);
    } catch (error) {
      console.error('Error loading applications:', error);
      alert('Error loading applications. Make sure the backend is running.');
    }
  };

  const handleReview = (app) => {
    setSelectedApp(app);
    setReviewForm({
      status: 'APPROVED',
      approvedCreditLimit: app.approvedCreditLimit || '',
      rejectionReason: '',
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
        approvedCreditLimit: reviewForm.status === 'APPROVED' ? parseFloat(reviewForm.approvedCreditLimit) : null,
        rejectionReason: reviewForm.status === 'REJECTED' ? reviewForm.rejectionReason : null,
        reviewedBy: reviewForm.reviewedBy
      };

      await axios.put('http://localhost:8083/api/credit-cards/applications/review', dataToSend, {
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

  const handleIssueCard = async (application) => {
    if (!application) return;

    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      
      // Call the issue card API
      await axios.post(`http://localhost:8083/api/credit-cards/applications/${application.applicationNumber}/issue-card`, {}, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update local state to show card has been issued
      setApplications(prev => prev.map(app => 
        app.applicationNumber === application.applicationNumber 
          ? { ...app, cardIssued: true, cardIssuedAt: new Date().toISOString() }
          : app
      ));

      alert(`Credit card issued successfully for application ${application.applicationNumber}!`);
    } catch (error) {
      console.error('Failed to issue card:', error);
      alert('Failed to issue card');
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
          <MdCreditCard style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Credit Card Application Review
        </h1>
        <p className="boa-page-subtitle">Review and approve/reject customer applications</p>
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
      {filteredApps.length > 0 ? (
        <div className="boa-card">
          <div className="boa-table-container">
            <table className="boa-table">
              <thead>
                <tr>
                  <th>Application #</th>
                  <th>Applicant</th>
                  <th>Card Type</th>
                  <th>Income</th>
                  <th>Credit Score</th>
                  <th>Requested Limit</th>
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
                      <div style={{ fontWeight: '600' }}>{app.cardHolderName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--boa-gray-600)' }}>{app.email}</div>
                    </td>
                    <td>
                      <MdCreditCard style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      {app.cardType}
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      ${parseFloat(app.annualIncome).toLocaleString()}
                    </td>
                    <td>
                      <span style={{ 
                        fontWeight: '600',
                        color: app.creditScore >= 700 ? 'var(--boa-success)' : app.creditScore >= 650 ? 'var(--boa-warning)' : 'var(--boa-danger)'
                      }}>
                        {app.creditScore || 'N/A'}
                      </span>
                    </td>
                    <td>
                      {app.approvedCreditLimit ? 
                        `$${parseFloat(app.approvedCreditLimit).toLocaleString()}` : 
                        'Not set'
                      }
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
                          <button 
                            className="boa-button-small"
                            onClick={() => handleIssueCard(app)}
                            style={{ background: 'var(--boa-success)', color: 'black', fontWeight: '600' }}
                          >
                            Issue Card
                          </button>
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
          <p>There are no {statusFilter.toLowerCase()} credit card applications at this time.</p>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedApp && (
        <div className="boa-modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="boa-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="boa-modal-header">
              <h3>Review Application: {selectedApp.applicationNumber}</h3>
              <button className="boa-modal-close" onClick={() => setShowReviewModal(false)}>×</button>
            </div>
            <div className="boa-modal-body">
              {/* Application Details */}
              <div style={{ background: 'var(--boa-gray-50)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '15px' }}>Application Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                  <div>
                    <strong>Applicant:</strong> {selectedApp.cardHolderName}
                  </div>
                  <div>
                    <strong>Card Type:</strong> {selectedApp.cardType}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedApp.email}
                  </div>
                  <div>
                    <strong>Phone:</strong> {selectedApp.phoneNumber}
                  </div>
                  <div>
                    <strong>Annual Income:</strong> ${parseFloat(selectedApp.annualIncome).toLocaleString()}
                  </div>
                  <div>
                    <strong>Credit Score:</strong> <span style={{ fontWeight: '600' }}>{selectedApp.creditScore}</span>
                  </div>
                  <div>
                    <strong>Employment:</strong> {selectedApp.employmentStatus}
                  </div>
                  <div>
                    <strong>Housing Payment:</strong> ${parseFloat(selectedApp.monthlyHousingPayment || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Review Form */}
              <form onSubmit={handleSubmitReview}>
                <div className="boa-form-group">
                  <label className="boa-label">Decision *</label>
                  <select
                    className="boa-input"
                    value={reviewForm.status}
                    onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                    required
                    disabled={selectedApp.applicationStatus !== 'PENDING'}
                  >
                    <option value="APPROVED">Approve</option>
                    <option value="REJECTED">Reject</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                  </select>
                </div>

                {reviewForm.status === 'APPROVED' && (
                  <div className="boa-form-group">
                    <label className="boa-label">Approved Credit Limit * (USD)</label>
                    <input
                      type="number"
                      className="boa-input"
                      value={reviewForm.approvedCreditLimit}
                      onChange={(e) => setReviewForm({ ...reviewForm, approvedCreditLimit: e.target.value })}
                      required
                      min="1000"
                      max="50000"
                      step="100"
                      placeholder="5000"
                      disabled={selectedApp.applicationStatus !== 'PENDING'}
                    />
                    <p style={{ fontSize: '12px', color: 'var(--boa-gray-600)', marginTop: '4px' }}>
                      Suggested: ${selectedApp.approvedCreditLimit || 'Calculate based on income and score'}
                    </p>
                  </div>
                )}

                {reviewForm.status === 'REJECTED' && (
                  <div className="boa-form-group">
                    <label className="boa-label">Rejection Reason *</label>
                    <textarea
                      className="boa-input"
                      value={reviewForm.rejectionReason}
                      onChange={(e) => setReviewForm({ ...reviewForm, rejectionReason: e.target.value })}
                      required
                      rows="3"
                      placeholder="e.g., Credit score below minimum requirements, Insufficient income..."
                      disabled={selectedApp.applicationStatus !== 'PENDING'}
                    />
                  </div>
                )}

                <div className="boa-form-actions">
                  <button 
                    type="button" 
                    className="boa-button-outline"
                    onClick={() => setShowReviewModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  {selectedApp.applicationStatus === 'PENDING' && (
                    <button 
                      type="submit" 
                      className="boa-button"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Submit Review'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreditCardReview;

