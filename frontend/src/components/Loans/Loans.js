import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { loanAPI } from '../../services/api';
import { MdAttachMoney, MdHome, MdDirectionsCar, MdPerson, MdSchool, MdAssignment } from 'react-icons/md';
import '../Dashboard/Dashboard.css';

function Loans() {
  const { user } = useSelector(state => state.auth);
  const [loans, setLoans] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('loans');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loading, setLoading] = useState(false);

  const [applicationForm, setApplicationForm] = useState({
    userId: user?.id || '',
    applicantName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    loanType: 'PERSONAL_LOAN',
    loanAmount: '',
    tenureMonths: 24,
    purpose: '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    employmentType: 'EMPLOYED',
    employerName: '',
    monthlyIncome: '',
    employmentYears: '',
    existingLoans: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    loanNumber: '',
    amount: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      loadLoans();
      loadApplications();
      setApplicationForm(prev => ({
        ...prev,
        userId: user.id,
        applicantName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      }));
    }
  }, [user]);

  const loadLoans = async () => {
    try {
      const response = await loanAPI.getLoansByUser(user.id);
      setLoans(response.data);
    } catch (error) {
      console.error('Error loading loans:', error);
    }
  };

  const loadApplications = async () => {
    try {
      const response = await loanAPI.getApplicationsByUser(user.id);
      setApplications(response.data);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSend = {
        ...applicationForm,
        loanAmount: parseFloat(applicationForm.loanAmount),
        monthlyIncome: parseFloat(applicationForm.monthlyIncome),
        employmentYears: applicationForm.employmentYears ? parseInt(applicationForm.employmentYears) : null,
        existingLoans: applicationForm.existingLoans ? parseFloat(applicationForm.existingLoans) : 0
      };
      
      const response = await loanAPI.applyForLoan(dataToSend);
      alert(`Application submitted successfully!\nApplication Number: ${response.data.applicationNumber}\nStatus: ${response.data.applicationStatus}`);
      
      if (response.data.applicationStatus === 'APPROVED') {
        alert(`Congratulations! Your loan has been approved!\nApproved Amount: $${response.data.approvedAmount}\nInterest Rate: ${response.data.approvedInterestRate}%\nMonthly EMI: $${response.data.monthlyEmi}\nCredit Score: ${response.data.creditScore}`);
      } else if (response.data.applicationStatus === 'REJECTED') {
        alert(`Application rejected. Reason: ${response.data.rejectionReason}`);
      }
      
      setShowApplicationForm(false);
      loadApplications();
      setActiveTab('applications');
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting application');
    } finally {
      setLoading(false);
    }
  };

  const handleDisburseLoan = async (applicationNumber) => {
    if (!window.confirm('Disburse loan for this approved application?')) return;
    
    try {
      await loanAPI.disburseLoan(applicationNumber);
      alert('Loan disbursed successfully!');
      loadLoans();
      loadApplications();
      setActiveTab('loans');
    } catch (error) {
      alert(error.response?.data?.message || 'Error disbursing loan');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await loanAPI.makePayment({
        loanNumber: selectedLoan.loanNumber,
        amount: parseFloat(paymentForm.amount),
        description: paymentForm.description || 'EMI Payment'
      });
      alert('Payment successful!');
      setShowPaymentModal(false);
      setPaymentForm({ loanNumber: '', amount: '', description: '' });
      loadLoans();
    } catch (error) {
      alert(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const getLoanTypeIcon = (loanType) => {
    switch(loanType) {
      case 'HOME_LOAN': return <MdHome style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      case 'AUTO_LOAN': return <MdDirectionsCar style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      case 'PERSONAL_LOAN': return <MdPerson style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      case 'EDUCATION_LOAN': return <MdSchool style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      default: return <MdAttachMoney style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'PENDING': 'warning',
      'APPROVED': 'success',
      'REJECTED': 'danger',
      'UNDER_REVIEW': 'info',
      'DISBURSED': 'success',
      'ACTIVE': 'success',
      'CLOSED': 'secondary'
    };
    return `boa-status-${statusColors[status] || 'secondary'}`;
  };

  return (
    <div>
      <div className="boa-page-header">
        <h1 className="boa-page-title">Loans</h1>
        <p className="boa-page-subtitle">Manage your loan applications and active loans</p>
      </div>
      
      {/* Tabs */}
      <div className="boa-card" style={{ marginBottom: '24px' }}>
        <div className="boa-tabs">
          <button 
            className={`boa-tab ${activeTab === 'loans' ? 'active' : ''}`}
            onClick={() => setActiveTab('loans')}
          >
            My Loans ({loans.length})
          </button>
          <button 
            className={`boa-tab ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            Applications ({applications.length})
          </button>
          <button 
            className={`boa-tab ${activeTab === 'apply' ? 'active' : ''}`}
            onClick={() => { setActiveTab('apply'); setShowApplicationForm(true); }}
          >
            Apply for Loan
          </button>
        </div>
      </div>

      {/* My Loans Tab */}
      {activeTab === 'loans' && (
        <>
          {loans.length > 0 ? (
            <div className="boa-dashboard-grid boa-dashboard-grid-2">
              {loans.map(loan => (
                <div key={loan.id} className="boa-account-card">
                  <div className="boa-account-header">
                    <div className="boa-account-type">
                      <h4>{getLoanTypeIcon(loan.loanType)} {loan.loanType.replace('_', ' ')}</h4>
                      <span className={getStatusBadge(loan.loanStatus)}>
                        {loan.loanStatus}
                      </span>
                    </div>
                  </div>
                  <div className="boa-account-details">
                    <p style={{ fontFamily: 'monospace', fontSize: '13px', marginBottom: '8px' }}>
                      {loan.loanNumber}
                    </p>
                    <h2 className="boa-account-balance" style={{ color: 'var(--boa-danger)' }}>
                      ${parseFloat(loan.outstandingAmount || 0).toFixed(2)}
                    </h2>
                    <p style={{color: 'var(--boa-gray-600)', fontSize: '12px'}}>
                      Outstanding / ${parseFloat(loan.loanAmount).toFixed(2)} Total
                    </p>
                    <div style={{ marginTop: '12px', padding: '12px', background: 'var(--boa-gray-50)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--boa-gray-600)' }}>Monthly EMI:</span>
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>${parseFloat(loan.monthlyEmi).toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--boa-gray-600)' }}>Interest Rate:</span>
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>{parseFloat(loan.interestRate).toFixed(2)}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: 'var(--boa-gray-600)' }}>Tenure:</span>
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>{loan.tenureMonths} months</span>
                      </div>
                    </div>
                  </div>
                  <div className="boa-account-actions">
                    <button 
                      className="boa-button"
                      onClick={() => {
                        setSelectedLoan(loan);
                        setPaymentForm({ ...paymentForm, amount: loan.monthlyEmi });
                        setShowPaymentModal(true);
                      }}
                      disabled={loan.loanStatus !== 'ACTIVE'}
                    >
                      Make Payment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="boa-empty-state">
              <div className="boa-empty-icon">
                <MdAttachMoney />
              </div>
              <h3>No Active Loans</h3>
              <p>Apply for a loan to get started</p>
              <button 
                className="boa-button"
                onClick={() => { setActiveTab('apply'); setShowApplicationForm(true); }}
              >
                Apply for Loan
              </button>
            </div>
          )}
        </>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <>
          {applications.length > 0 ? (
            <div className="boa-card">
              <div className="boa-table-container">
                <table className="boa-table">
                  <thead>
                    <tr>
                      <th>Application #</th>
                      <th>Loan Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>EMI</th>
                      <th>Rate</th>
                      <th>Applied Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                          {app.applicationNumber}
                        </td>
                        <td>{getLoanTypeIcon(app.loanType)} {app.loanType.replace('_', ' ')}</td>
                        <td style={{ fontWeight: '600' }}>${parseFloat(app.loanAmount).toFixed(0)}</td>
                        <td>
                          <span className={getStatusBadge(app.applicationStatus)}>
                            {app.applicationStatus}
                          </span>
                        </td>
                        <td>
                          {app.monthlyEmi ? (
                            <span style={{ color: 'var(--boa-success)', fontWeight: '600' }}>
                              ${parseFloat(app.monthlyEmi).toFixed(2)}
                            </span>
                          ) : '-'}
                        </td>
                        <td>
                          {app.approvedInterestRate ? `${parseFloat(app.approvedInterestRate).toFixed(2)}%` : '-'}
                        </td>
                        <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td>
                          {app.applicationStatus === 'APPROVED' && (
                            <button 
                              className="boa-button-small"
                              onClick={() => handleDisburseLoan(app.applicationNumber)}
                            >
                              Disburse Loan
                            </button>
                          )}
                          {app.applicationStatus === 'REJECTED' && app.rejectionReason && (
                            <span style={{ fontSize: '12px', color: 'var(--boa-danger)' }}>
                              {app.rejectionReason}
                            </span>
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
              <h3>No Applications Yet</h3>
              <p>You haven't submitted any loan applications</p>
              <button 
                className="boa-button"
                onClick={() => { setActiveTab('apply'); setShowApplicationForm(true); }}
              >
                Apply Now
              </button>
            </div>
          )}
        </>
      )}

      {/* Application Form Tab */}
      {activeTab === 'apply' && showApplicationForm && (
        <div className="boa-card">
          <div className="boa-card-header">
            <h3>Loan Application</h3>
            <p style={{ color: 'var(--boa-gray-600)', fontSize: '14px', marginTop: '8px' }}>
              Complete the form below to apply for a loan. We'll review your application and get back to you.
            </p>
          </div>
          <div className="boa-card-body">
            <form onSubmit={handleApplicationSubmit} className="boa-form">
              {/* Loan Details */}
              <div className="boa-form-section">
                <h4 className="boa-form-section-title">Loan Details</h4>
                <div className="boa-form-row">
                  <div className="boa-form-group">
                    <label className="boa-label">Loan Type *</label>
                    <select
                      className="boa-input"
                      value={applicationForm.loanType}
                      onChange={(e) => setApplicationForm({ ...applicationForm, loanType: e.target.value })}
                      required
                    >
                      <option value="PERSONAL_LOAN">Personal Loan</option>
                      <option value="HOME_LOAN">Home Loan</option>
                      <option value="AUTO_LOAN">Auto Loan</option>
                      <option value="EDUCATION_LOAN">Education Loan</option>
                    </select>
                  </div>
                  <div className="boa-form-group">
                    <label className="boa-label">Loan Amount * (USD)</label>
                    <input
                      type="number"
                      className="boa-input"
                      value={applicationForm.loanAmount}
                      onChange={(e) => setApplicationForm({ ...applicationForm, loanAmount: e.target.value })}
                      required
                      min="1000"
                      step="1000"
                      placeholder="50000"
                    />
                  </div>
                </div>
                <div className="boa-form-row">
                  <div className="boa-form-group">
                    <label className="boa-label">Tenure (Months) *</label>
                    <select
                      className="boa-input"
                      value={applicationForm.tenureMonths}
                      onChange={(e) => setApplicationForm({ ...applicationForm, tenureMonths: parseInt(e.target.value) })}
                      required
                    >
                      <option value="6">6 months</option>
                      <option value="12">12 months (1 year)</option>
                      <option value="24">24 months (2 years)</option>
                      <option value="36">36 months (3 years)</option>
                      <option value="60">60 months (5 years)</option>
                      <option value="120">120 months (10 years)</option>
                      <option value="180">180 months (15 years)</option>
                      <option value="240">240 months (20 years)</option>
                      <option value="360">360 months (30 years)</option>
                    </select>
                  </div>
                  <div className="boa-form-group">
                    <label className="boa-label">Applicant Name *</label>
                    <input
                      type="text"
                      className="boa-input"
                      value={applicationForm.applicantName}
                      onChange={(e) => setApplicationForm({ ...applicationForm, applicantName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="boa-form-group">
                  <label className="boa-label">Purpose of Loan *</label>
                  <textarea
                    className="boa-input"
                    value={applicationForm.purpose}
                    onChange={(e) => setApplicationForm({ ...applicationForm, purpose: e.target.value })}
                    required
                    rows="2"
                    placeholder="e.g., Home renovation, Car purchase, Education fees"
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div className="boa-form-section">
                <h4 className="boa-form-section-title">Personal Information</h4>
                <div className="boa-form-row">
                  <div className="boa-form-group">
                    <label className="boa-label">Email *</label>
                    <input
                      type="email"
                      className="boa-input"
                      value={applicationForm.email}
                      onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="boa-form-group">
                    <label className="boa-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="boa-input"
                      value={applicationForm.phoneNumber}
                      onChange={(e) => setApplicationForm({ ...applicationForm, phoneNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="boa-form-group">
                  <label className="boa-label">Date of Birth *</label>
                  <input
                    type="date"
                    className="boa-input"
                    value={applicationForm.dateOfBirth}
                    onChange={(e) => setApplicationForm({ ...applicationForm, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="boa-form-section">
                <h4 className="boa-form-section-title">Address Information</h4>
                <div className="boa-form-group">
                  <label className="boa-label">Street Address *</label>
                  <input
                    type="text"
                    className="boa-input"
                    value={applicationForm.address}
                    onChange={(e) => setApplicationForm({ ...applicationForm, address: e.target.value })}
                    required
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="boa-form-row">
                  <div className="boa-form-group">
                    <label className="boa-label">City *</label>
                    <input
                      type="text"
                      className="boa-input"
                      value={applicationForm.city}
                      onChange={(e) => setApplicationForm({ ...applicationForm, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="boa-form-group">
                    <label className="boa-label">State *</label>
                    <input
                      type="text"
                      className="boa-input"
                      value={applicationForm.state}
                      onChange={(e) => setApplicationForm({ ...applicationForm, state: e.target.value })}
                      required
                      maxLength="2"
                      placeholder="NY"
                    />
                  </div>
                  <div className="boa-form-group">
                    <label className="boa-label">ZIP Code *</label>
                    <input
                      type="text"
                      className="boa-input"
                      value={applicationForm.zipCode}
                      onChange={(e) => setApplicationForm({ ...applicationForm, zipCode: e.target.value.replace(/\D/g, '') })}
                      required
                      maxLength="5"
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>

              {/* Employment & Financial Information */}
              <div className="boa-form-section">
                <h4 className="boa-form-section-title">Employment & Financial Information</h4>
                <div className="boa-form-row">
                  <div className="boa-form-group">
                    <label className="boa-label">Employment Type *</label>
                    <select
                      className="boa-input"
                      value={applicationForm.employmentType}
                      onChange={(e) => setApplicationForm({ ...applicationForm, employmentType: e.target.value })}
                      required
                    >
                      <option value="EMPLOYED">Employed</option>
                      <option value="SELF_EMPLOYED">Self-Employed</option>
                      <option value="BUSINESS">Business Owner</option>
                      <option value="RETIRED">Retired</option>
                      <option value="STUDENT">Student</option>
                    </select>
                  </div>
                  <div className="boa-form-group">
                    <label className="boa-label">Monthly Income * (USD)</label>
                    <input
                      type="number"
                      className="boa-input"
                      value={applicationForm.monthlyIncome}
                      onChange={(e) => setApplicationForm({ ...applicationForm, monthlyIncome: e.target.value })}
                      required
                      min="1000"
                      step="100"
                      placeholder="5000"
                    />
                  </div>
                </div>
                <div className="boa-form-row">
                  <div className="boa-form-group">
                    <label className="boa-label">Employer Name</label>
                    <input
                      type="text"
                      className="boa-input"
                      value={applicationForm.employerName}
                      onChange={(e) => setApplicationForm({ ...applicationForm, employerName: e.target.value })}
                      placeholder="ABC Company"
                    />
                  </div>
                  <div className="boa-form-group">
                    <label className="boa-label">Employment Years</label>
                    <input
                      type="number"
                      className="boa-input"
                      value={applicationForm.employmentYears}
                      onChange={(e) => setApplicationForm({ ...applicationForm, employmentYears: e.target.value })}
                      min="0"
                      max="50"
                      placeholder="5"
                    />
                  </div>
                </div>
                <div className="boa-form-group">
                  <label className="boa-label">Existing Loans (Monthly Obligation)</label>
                  <input
                    type="number"
                    className="boa-input"
                    value={applicationForm.existingLoans}
                    onChange={(e) => setApplicationForm({ ...applicationForm, existingLoans: e.target.value })}
                    min="0"
                    step="100"
                    placeholder="0"
                  />
                  <p style={{ fontSize: '12px', color: 'var(--boa-gray-600)', marginTop: '4px' }}>
                    Total monthly payment on all existing loans
                  </p>
                </div>
              </div>

              <div style={{ background: 'var(--boa-gray-50)', padding: '16px', borderRadius: '8px', marginTop: '24px' }}>
                <p style={{ fontSize: '12px', color: 'var(--boa-gray-600)', margin: '0' }}>
                  📋 <strong>Note:</strong> Your application will be evaluated based on your income, employment status, 
                  and credit history. Most applications receive an instant decision.
                </p>
              </div>

              <div className="boa-form-actions">
                <button 
                  type="button" 
                  className="boa-button-outline"
                  onClick={() => setShowApplicationForm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="boa-button"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedLoan && (
        <div className="boa-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="boa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="boa-modal-header">
              <h3>Make Loan Payment</h3>
              <button className="boa-modal-close" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            <div className="boa-modal-body">
              <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--boa-gray-50)', borderRadius: '8px' }}>
                <p style={{ margin: '0', fontSize: '14px' }}>
                  <strong>Loan:</strong> {selectedLoan.loanNumber}
                </p>
                <p style={{ margin: '8px 0 0', fontSize: '14px' }}>
                  <strong>Monthly EMI:</strong> ${parseFloat(selectedLoan.monthlyEmi).toFixed(2)}
                </p>
                <p style={{ margin: '8px 0 0', fontSize: '14px' }}>
                  <strong>Outstanding:</strong> ${parseFloat(selectedLoan.outstandingAmount || 0).toFixed(2)}
                </p>
              </div>
              <form onSubmit={handlePayment}>
                <div className="boa-form-group">
                  <label className="boa-label">Payment Amount *</label>
                  <input
                    type="number"
                    className="boa-input"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div className="boa-form-group">
                  <label className="boa-label">Description</label>
                  <textarea
                    className="boa-input"
                    value={paymentForm.description}
                    onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                    rows="3"
                    placeholder="EMI Payment"
                  />
                </div>
                <div className="boa-form-actions">
                  <button 
                    type="button" 
                    className="boa-button-outline"
                    onClick={() => setShowPaymentModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="boa-button"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Make Payment'}
                  </button>
                </div>
              </form>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default Loans;
