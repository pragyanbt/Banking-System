import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { creditCardAPI } from '../../services/api';
import { MdCreditCard, MdAssignment, MdDiamond, MdStar } from 'react-icons/md';
import '../Dashboard/Dashboard.css';

function CreditCards() {
  const { user } = useSelector(state => state.auth);
  const [cards, setCards] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('cards'); // 'cards', 'apply', 'applications'
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionType, setTransactionType] = useState('purchase'); // 'purchase' or 'payment'
  const [loading, setLoading] = useState(false);

  const [applicationForm, setApplicationForm] = useState({
    userId: user?.id || '',
    cardHolderName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    cardType: 'VISA',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: '',
    ssnLastFour: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    employmentStatus: 'EMPLOYED',
    employerName: '',
    jobTitle: '',
    annualIncome: '',
    monthlyHousingPayment: ''
  });

  const [transactionForm, setTransactionForm] = useState({
    cardNumber: '',
    amount: '',
    merchantName: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
    loadCards();
      loadApplications();
      setApplicationForm(prev => ({
        ...prev,
        userId: user.id,
        cardHolderName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      }));
    }
  }, [user]);

  const loadCards = async () => {
    try {
      const response = await creditCardAPI.getCardsByUser(user.id);
      setCards(response.data);
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  };

  const loadApplications = async () => {
    try {
      const response = await creditCardAPI.getApplicationsByUser(user.id);
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
        annualIncome: parseFloat(applicationForm.annualIncome),
        monthlyHousingPayment: applicationForm.monthlyHousingPayment ? 
          parseFloat(applicationForm.monthlyHousingPayment) : 0
      };
      
      const response = await creditCardAPI.applyForCard(dataToSend);
      alert(`Application submitted successfully! Application Number: ${response.data.applicationNumber}\nStatus: ${response.data.applicationStatus}\n\nYour application is now under review. You will be notified once a decision is made.`);
      
      setShowApplicationForm(false);
      loadApplications();
      setActiveTab('applications');
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting application');
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCard = async (applicationNumber) => {
    if (!window.confirm('Issue card for this approved application?')) return;
    
    try {
      await creditCardAPI.issueCard(applicationNumber);
      alert('Credit card issued successfully!');
      loadCards();
      loadApplications();
      setActiveTab('cards');
    } catch (error) {
      alert(error.response?.data?.message || 'Error issuing card');
    }
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = {
        cardNumber: selectedCard.cardNumber,
        amount: parseFloat(transactionForm.amount),
        merchantName: transactionForm.merchantName,
        description: transactionForm.description
      };
      
      if (transactionType === 'purchase') {
        await creditCardAPI.makePurchase(data);
        alert('Purchase successful!');
      } else {
        await creditCardAPI.makePayment(data);
        alert('Payment successful!');
      }
      
      setShowTransactionForm(false);
      setTransactionForm({ cardNumber: '', amount: '', merchantName: '', description: '' });
      loadCards();
    } catch (error) {
      alert(error.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockCard = async (cardNumber) => {
    if (!window.confirm('Are you sure you want to block this card?')) return;
    
    try {
      await creditCardAPI.blockCard(cardNumber);
      alert('Card blocked successfully');
      loadCards();
    } catch (error) {
      alert(error.response?.data?.message || 'Error blocking card');
    }
  };

  const handleUnblockCard = async (cardNumber) => {
    if (!window.confirm('Unblock this card?')) return;
    
    try {
      await creditCardAPI.unblockCard(cardNumber);
      alert('Card unblocked successfully');
      loadCards();
    } catch (error) {
      alert(error.response?.data?.message || 'Error unblocking card');
    }
  };

  const getCardTypeIcon = (cardType) => {
    switch(cardType) {
      case 'VISA': return <MdCreditCard style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      case 'MASTERCARD': return <MdCreditCard style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      case 'AMERICAN_EXPRESS': return <MdDiamond style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      case 'DISCOVER': return <MdStar style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      default: return <MdCreditCard style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
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
        <h1 className="boa-page-title">Credit Cards</h1>
        <p className="boa-page-subtitle">Manage your credit cards and applications</p>
      </div>

      {/* Tabs */}
      <div className="boa-card" style={{ marginBottom: '24px' }}>
        <div className="boa-tabs">
          <button 
            className={`boa-tab ${activeTab === 'cards' ? 'active' : ''}`}
            onClick={() => setActiveTab('cards')}
          >
            My Cards ({cards.length})
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
            Apply for Card
          </button>
        </div>
      </div>

      {/* My Cards Tab */}
      {activeTab === 'cards' && (
        <>
      {cards.length > 0 ? (
        <div className="boa-dashboard-grid boa-dashboard-grid-2">
          {cards.map(card => (
            <div key={card.id} className="boa-account-card">
              <div className="boa-account-header">
                <div className="boa-account-type">
                      <h4>{getCardTypeIcon(card.cardType)} {card.cardType}</h4>
                  <span className={`boa-status-${!card.isBlocked ? 'active' : 'inactive'}`}>
                    {!card.isBlocked ? 'Active' : 'Blocked'}
                  </span>
                </div>
              </div>
              <div className="boa-account-details">
                    <p className="boa-account-number" style={{ fontFamily: 'monospace' }}>
                      •••• •••• •••• {card.cardNumber.slice(-4)}
                    </p>
                    <h2 className="boa-account-balance" style={{ color: 'var(--boa-success)' }}>
                      ${parseFloat(card.availableCredit).toFixed(2)}
                    </h2>
                <p style={{color: 'var(--boa-gray-600)', fontSize: '12px'}}>
                      Available Credit / ${parseFloat(card.creditLimit).toFixed(2)} Limit
                    </p>
                    {card.outstandingBalance > 0 && (
                      <p style={{color: 'var(--boa-danger)', fontSize: '12px', marginTop: '8px'}}>
                        Outstanding: ${parseFloat(card.outstandingBalance).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="boa-account-actions">
                    <button 
                      className="boa-button-outline boa-button-small"
                      onClick={() => {
                        setSelectedCard(card);
                        setTransactionType('purchase');
                        setShowTransactionForm(true);
                      }}
                      disabled={card.isBlocked}
                    >
                      Make Purchase
                    </button>
                    <button 
                      className="boa-button-outline boa-button-small"
                      onClick={() => {
                        setSelectedCard(card);
                        setTransactionType('payment');
                        setShowTransactionForm(true);
                      }}
                      disabled={card.isBlocked}
                    >
                      Make Payment
                    </button>
                    <button 
                      className={`boa-button-outline boa-button-small ${card.isBlocked ? 'boa-button-success' : 'boa-button-danger'}`}
                      onClick={() => card.isBlocked ? handleUnblockCard(card.cardNumber) : handleBlockCard(card.cardNumber)}
                    >
                      {card.isBlocked ? 'Unblock' : 'Block'}
                    </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="boa-empty-state">
          <div className="boa-empty-icon">
            <MdCreditCard />
          </div>
          <h3>No Credit Cards Yet</h3>
          <p>Apply for a credit card to start building your credit</p>
              <button 
                className="boa-button"
                onClick={() => { setActiveTab('apply'); setShowApplicationForm(true); }}
              >
                Apply for Credit Card
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
                      <th>Card Type</th>
                      <th>Status</th>
                      <th>Credit Score</th>
                      <th>Approved Limit</th>
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
                        <td>{getCardTypeIcon(app.cardType)} {app.cardType}</td>
                        <td>
                          <span className={getStatusBadge(app.applicationStatus)}>
                            {app.applicationStatus}
                          </span>
                        </td>
                        <td>
                          {app.creditScore ? (
                            <span style={{ fontWeight: '600' }}>{app.creditScore}</span>
                          ) : 'N/A'}
                        </td>
                        <td>
                          {app.approvedCreditLimit ? (
                            <span style={{ color: 'var(--boa-success)', fontWeight: '600' }}>
                              ${parseFloat(app.approvedCreditLimit).toFixed(0)}
                            </span>
                          ) : '-'}
                        </td>
                        <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td>
                          {app.applicationStatus === 'PENDING' && (
                            <span style={{ color: 'var(--boa-warning)', fontSize: '12px' }}>
                              Under Review
                            </span>
                          )}
                          {app.applicationStatus === 'APPROVED' && !app.cardIssued && (
                            <span style={{ color: 'var(--boa-success)', fontSize: '12px' }}>
                              Approved - Card Pending
                            </span>
                          )}
                          {app.applicationStatus === 'APPROVED' && app.cardIssued && (
                            <span style={{ color: 'var(--boa-success)', fontSize: '12px' }}>
                              Card Issued
                            </span>
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
              <p>You haven't submitted any credit card applications</p>
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
            <h3>Credit Card Application</h3>
            <p style={{ color: 'var(--boa-gray-600)', fontSize: '14px', marginTop: '8px' }}>
              Fill out the form below to apply for a credit card. We'll review your application and get back to you shortly.
            </p>
          </div>
          <div className="boa-card-body">
            <form onSubmit={handleApplicationSubmit} className="boa-form">
              {/* Card Selection */}
              <div className="boa-form-section">
                <h4 className="boa-form-section-title">Card Selection</h4>
                <div className="boa-form-row">
                  <div className="boa-form-group">
                    <label className="boa-label">Card Type *</label>
                    <select
                      className="boa-input"
                      value={applicationForm.cardType}
                      onChange={(e) => setApplicationForm({ ...applicationForm, cardType: e.target.value })}
                      required
                    >
                      <option value="VISA">VISA - Standard Card</option>
                      <option value="MASTERCARD">MasterCard - Rewards Card</option>
                      <option value="AMERICAN_EXPRESS">American Express - Premium Card</option>
                      <option value="DISCOVER">Discover - Cashback Card</option>
                    </select>
                  </div>
                  <div className="boa-form-group">
                    <label className="boa-label">Card Holder Name *</label>
                    <input
                      type="text"
                      className="boa-input"
                      value={applicationForm.cardHolderName}
                      onChange={(e) => setApplicationForm({ ...applicationForm, cardHolderName: e.target.value })}
                      required
                    />
                  </div>
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
                <div className="boa-form-row">
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
                  <div className="boa-form-group">
                    <label className="boa-label">SSN (Last 4 digits)</label>
                    <input
                      type="text"
                      className="boa-input"
                      maxLength="4"
                      value={applicationForm.ssnLastFour}
                      onChange={(e) => setApplicationForm({ ...applicationForm, ssnLastFour: e.target.value.replace(/\D/g, '') })}
                      placeholder="1234"
                    />
                  </div>
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
                    value={applicationForm.addressLine1}
                    onChange={(e) => setApplicationForm({ ...applicationForm, addressLine1: e.target.value })}
                    required
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="boa-form-group">
                  <label className="boa-label">Apartment, Suite, etc.</label>
                  <input
                    type="text"
                    className="boa-input"
                    value={applicationForm.addressLine2}
                    onChange={(e) => setApplicationForm({ ...applicationForm, addressLine2: e.target.value })}
                    placeholder="Apt 4B"
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
                    <label className="boa-label">Employment Status *</label>
                    <select
                      className="boa-input"
                      value={applicationForm.employmentStatus}
                      onChange={(e) => setApplicationForm({ ...applicationForm, employmentStatus: e.target.value })}
                      required
                    >
                      <option value="EMPLOYED">Employed</option>
                      <option value="SELF_EMPLOYED">Self-Employed</option>
                      <option value="STUDENT">Student</option>
                      <option value="RETIRED">Retired</option>
                      <option value="UNEMPLOYED">Unemployed</option>
                    </select>
                  </div>
                  <div className="boa-form-group">
                    <label className="boa-label">Annual Income * (USD)</label>
                    <input
                      type="number"
                      className="boa-input"
                      value={applicationForm.annualIncome}
                      onChange={(e) => setApplicationForm({ ...applicationForm, annualIncome: e.target.value })}
                      required
                      min="0"
                      step="1000"
                      placeholder="50000"
                    />
                  </div>
                </div>
                {(applicationForm.employmentStatus === 'EMPLOYED' || applicationForm.employmentStatus === 'SELF_EMPLOYED') && (
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
                      <label className="boa-label">Job Title</label>
                      <input
                        type="text"
                        className="boa-input"
                        value={applicationForm.jobTitle}
                        onChange={(e) => setApplicationForm({ ...applicationForm, jobTitle: e.target.value })}
                        placeholder="Software Engineer"
                      />
                    </div>
                  </div>
                )}
                <div className="boa-form-group">
                  <label className="boa-label">Monthly Housing Payment (Rent/Mortgage)</label>
                  <input
                    type="number"
                    className="boa-input"
                    value={applicationForm.monthlyHousingPayment}
                    onChange={(e) => setApplicationForm({ ...applicationForm, monthlyHousingPayment: e.target.value })}
                    min="0"
                    step="100"
                    placeholder="1500"
                  />
                </div>
              </div>

              <div style={{ background: 'var(--boa-gray-50)', padding: '16px', borderRadius: '8px', marginTop: '24px' }}>
                <p style={{ fontSize: '12px', color: 'var(--boa-gray-600)', margin: '0' }}>
                  📋 <strong>Note:</strong> Your application will be reviewed based on your credit history, income, 
                  and employment status. You'll receive an instant decision for most applications.
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

      {/* Transaction Modal */}
      {showTransactionForm && selectedCard && (
        <div className="boa-modal-overlay" onClick={() => setShowTransactionForm(false)}>
          <div className="boa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="boa-modal-header">
              <h3>{transactionType === 'purchase' ? 'Make Purchase' : 'Make Payment'}</h3>
              <button className="boa-modal-close" onClick={() => setShowTransactionForm(false)}>×</button>
            </div>
            <div className="boa-modal-body">
              <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--boa-gray-50)', borderRadius: '8px' }}>
                <p style={{ margin: '0', fontSize: '14px' }}>
                  <strong>Card:</strong> {selectedCard.cardType} •••• {selectedCard.cardNumber.slice(-4)}
                </p>
                <p style={{ margin: '8px 0 0', fontSize: '14px' }}>
                  <strong>Available Credit:</strong> ${parseFloat(selectedCard.availableCredit).toFixed(2)}
                </p>
              </div>
              <form onSubmit={handleTransaction}>
                <div className="boa-form-group">
                  <label className="boa-label">Amount *</label>
                  <input
                    type="number"
                    className="boa-input"
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div className="boa-form-group">
                  <label className="boa-label">
                    {transactionType === 'purchase' ? 'Merchant Name' : 'Payment Description'}
                  </label>
                  <input
                    type="text"
                    className="boa-input"
                    value={transactionForm.merchantName}
                    onChange={(e) => setTransactionForm({ ...transactionForm, merchantName: e.target.value })}
                    placeholder={transactionType === 'purchase' ? 'Amazon, Walmart, etc.' : 'Monthly payment'}
                  />
                </div>
                <div className="boa-form-group">
                  <label className="boa-label">Description</label>
                  <textarea
                    className="boa-input"
                    value={transactionForm.description}
                    onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                    rows="3"
                    placeholder="Optional description"
                  />
                </div>
                <div className="boa-form-actions">
                  <button 
                    type="button" 
                    className="boa-button-outline"
                    onClick={() => setShowTransactionForm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="boa-button"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : (transactionType === 'purchase' ? 'Make Purchase' : 'Make Payment')}
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

export default CreditCards;
