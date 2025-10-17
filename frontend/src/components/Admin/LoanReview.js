import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { loanAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdAttachMoney, MdHome, MdDirectionsCar, MdPerson, MdSchool, MdBusiness, MdAssignment } from 'react-icons/md';
import '../Dashboard/Dashboard.css';

function LoanReview() {
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
    approvedAmount: '',
    approvedInterestRate: '',
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
      setLoading(true);
      // Load all applications regardless of status
      const response = await loanAPI.getApplicationsByStatus('ALL');
      setApplications(response.data);
    } catch (error) {
      console.error('Error loading loan applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (app) => {
    setSelectedApp(app);
    setReviewForm({
      status: 'APPROVED',
      approvedAmount: app.approvedAmount || app.loanAmount || '',
      approvedInterestRate: app.approvedInterestRate || '',
      rejectionReason: '',
      reviewedBy: user?.username || 'admin'
    });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        applicationNumber: selectedApp.applicationNumber,
        status: reviewForm.status,
        approvedAmount: reviewForm.status === 'APPROVED' ? parseFloat(reviewForm.approvedAmount) : null,
        approvedInterestRate: reviewForm.status === 'APPROVED' ? parseFloat(reviewForm.approvedInterestRate) : null,
        rejectionReason: reviewForm.status === 'REJECTED' ? reviewForm.rejectionReason : null,
        reviewedBy: reviewForm.reviewedBy
      };
      await loanAPI.reviewApplication(dataToSend);
      alert(`Loan application ${reviewForm.status.toLowerCase()} successfully!`);
      setShowReviewModal(false);
      loadApplications();
    } catch (error) {
      console.error('Error reviewing loan application:', error);
      alert(error.response?.data?.message || 'Error reviewing application');
    } finally {
      setLoading(false);
    }
  };

  const handleDisburseLoan = async (application) => {
    if (!window.confirm(`Are you sure you want to disburse the loan for application ${application.applicationNumber}?`)) {
      return;
    }

    try {
      setLoading(true);
      await loanAPI.disburseLoan(application.applicationNumber);
      alert(`Loan disbursed successfully for application ${application.applicationNumber}!`);
      loadApplications();
    } catch (error) {
      console.error('Error disbursing loan:', error);
      alert(error.response?.data?.message || 'Error disbursing loan');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'PENDING': 'warning',
      'APPROVED': 'success',
      'REJECTED': 'danger',
      'UNDER_REVIEW': 'info',
      'DISBURSED': 'success'
    };
    return `boa-status-${statusColors[status] || 'secondary'}`;
  };

  const getLoanTypeIcon = (loanType) => {
    switch(loanType) {
      case 'HOME_LOAN': return <MdHome style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      case 'AUTO_LOAN': return <MdDirectionsCar style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      case 'PERSONAL_LOAN': return <MdPerson style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      case 'EDUCATION_LOAN': return <MdSchool style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      case 'BUSINESS_LOAN': return <MdBusiness style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      default: return <MdAttachMoney style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
    }
  };

  return (
    <div>
      <div className="boa-page-header">
        <h1 className="boa-page-title">
          <MdAttachMoney style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Loan Application Review
        </h1>
        <p className="boa-page-subtitle">Review and approve/reject customer loan applications</p>
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
            className={`boa-tab ${statusFilter === 'DISBURSED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('DISBURSED')}
          >
            Disbursed ({applications.filter(a => a.applicationStatus === 'DISBURSED').length})
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
                  <th>Loan Type</th>
                  <th>Amount</th>
                  <th>Tenure</th>
                  <th>Monthly Income</th>
                  <th>Credit Score</th>
                  <th>EMI</th>
                  <th>Status</th>
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
                      <div style={{ fontWeight: '600' }}>{app.applicantName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--boa-gray-600)' }}>{app.email}</div>
                    </td>
                    <td>
                      {getLoanTypeIcon(app.loanType)}
                      <span style={{ marginLeft: '4px' }}>{app.loanType.replace('_', ' ')}</span>
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      ${parseFloat(app.loanAmount).toLocaleString()}
                    </td>
                    <td>{app.tenureMonths} months</td>
                    <td>${parseFloat(app.monthlyIncome).toLocaleString()}</td>
                    <td>
                      <span style={{ 
                        fontWeight: '600',
                        color: app.creditScore >= 700 ? 'var(--boa-success)' : app.creditScore >= 650 ? 'var(--boa-warning)' : 'var(--boa-danger)'
                      }}>
                        {app.creditScore || 'N/A'}
                      </span>
                    </td>
                    <td>
                      {app.monthlyEmi ? 
                        `$${parseFloat(app.monthlyEmi).toLocaleString()}` : 
                        '-'
                      }
                    </td>
                    <td>
                      <span className={getStatusBadge(app.applicationStatus)}>
                        {app.applicationStatus}
                      </span>
                    </td>
                    <td>
                      {app.applicationStatus === 'PENDING' || app.applicationStatus === 'UNDER_REVIEW' ? (
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
                            onClick={() => handleDisburseLoan(app)}
                            style={{ 
                              background: '#22c55e', 
                              color: 'white',
                              border: '1px solid #22c55e',
                              fontWeight: '600',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Disburse Loan
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
          <h3>No Loan Applications Found</h3>
          <p>There are no {statusFilter.toLowerCase()} loan applications at this time.</p>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedApp && (
        <div className="boa-modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="boa-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="boa-modal-header">
              <h3>Review Loan Application: {selectedApp.applicationNumber}</h3>
              <button className="boa-modal-close" onClick={() => setShowReviewModal(false)}>×</button>
            </div>
            <div className="boa-modal-body">
              {/* Application Details */}
              <div style={{ background: 'var(--boa-gray-50)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '15px' }}>Application Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '14px' }}>
                  <div>
                    <strong>Applicant:</strong> {selectedApp.applicantName}
                  </div>
                  <div>
                    <strong>Loan Type:</strong> {getLoanTypeIcon(selectedApp.loanType)} {selectedApp.loanType}
                  </div>
                  <div>
                    <strong>Loan Amount:</strong> ${parseFloat(selectedApp.loanAmount).toLocaleString()}
                  </div>
                  <div>
                    <strong>Tenure:</strong> {selectedApp.tenureMonths} months
                  </div>
                  <div>
                    <strong>Monthly Income:</strong> ${parseFloat(selectedApp.monthlyIncome).toLocaleString()}
                  </div>
                  <div>
                    <strong>Credit Score:</strong> <span style={{ fontWeight: '600' }}>{selectedApp.creditScore}</span>
                  </div>
                  <div>
                    <strong>Employment:</strong> {selectedApp.employmentType}
                  </div>
                  <div>
                    <strong>Employer:</strong> {selectedApp.employerName || 'N/A'}
                  </div>
                  <div>
                    <strong>Experience:</strong> {selectedApp.employmentYears || 'N/A'} years
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Purpose:</strong> {selectedApp.purpose}
                  </div>
                </div>
                {selectedApp.monthlyEmi && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--boa-gray-300)' }}>
                    <strong>Calculated EMI:</strong> ${parseFloat(selectedApp.monthlyEmi).toFixed(2)} @ {parseFloat(selectedApp.approvedInterestRate || 0).toFixed(2)}% interest
                  </div>
                )}
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
                    disabled={selectedApp.applicationStatus === 'DISBURSED'}
                  >
                    <option value="APPROVED">Approve</option>
                    <option value="REJECTED">Reject</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                  </select>
                </div>

                {reviewForm.status === 'APPROVED' && (
                  <>
                    <div className="boa-form-row">
                      <div className="boa-form-group">
                        <label className="boa-label">Approved Loan Amount * (USD)</label>
                        <input
                          type="number"
                          className="boa-input"
                          value={reviewForm.approvedAmount}
                          onChange={(e) => setReviewForm({ ...reviewForm, approvedAmount: e.target.value })}
                          required
                          min="1000"
                          step="1000"
                          placeholder="50000"
                          disabled={selectedApp.applicationStatus === 'DISBURSED'}
                        />
                      </div>
                      <div className="boa-form-group">
                        <label className="boa-label">Interest Rate * (%)</label>
                        <input
                          type="number"
                          className="boa-input"
                          value={reviewForm.approvedInterestRate}
                          onChange={(e) => setReviewForm({ ...reviewForm, approvedInterestRate: e.target.value })}
                          required
                          min="0"
                          max="30"
                          step="0.1"
                          placeholder="8.5"
                          disabled={selectedApp.applicationStatus === 'DISBURSED'}
                        />
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--boa-gray-600)', marginTop: '-8px' }}>
                      Requested: ${parseFloat(selectedApp.loanAmount).toLocaleString()} | Suggested Rate: Based on credit score and loan type
                    </p>
                  </>
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
                      placeholder="e.g., Insufficient income, Credit score below requirements, High debt-to-income ratio..."
                      disabled={selectedApp.applicationStatus === 'DISBURSED'}
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
                  {selectedApp.applicationStatus !== 'DISBURSED' && (
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

export default LoanReview;

