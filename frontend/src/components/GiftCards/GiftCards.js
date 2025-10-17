import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { giftCardAPI } from '../../services/api';
import { MdCardGiftcard, MdAssignment } from 'react-icons/md';
import '../Dashboard/Dashboard.css';

function GiftCards() {
  const { user } = useSelector(state => state.auth);
  const [giftCards, setGiftCards] = useState([]);
  const [activeTab, setActiveTab] = useState('cards');
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showRedeemForm, setShowRedeemForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [purchaseForm, setPurchaseForm] = useState({
    ownerId: user?.id || '',
    recipientName: '',
    recipientEmail: '',
    amount: '',
    message: ''
  });

  const [redeemForm, setRedeemForm] = useState({
    cardCode: '',
    accountNumber: '',
    userId: user?.id || ''
  });

  useEffect(() => {
    if (user) {
      loadGiftCards();
      setPurchaseForm(prev => ({ ...prev, ownerId: user.id }));
      setRedeemForm(prev => ({ ...prev, userId: user.id }));
    }
  }, [user]);

  const loadGiftCards = async () => {
    try {
      const response = await giftCardAPI.getGiftCardsByOwner(user.id);
      setGiftCards(response.data);
    } catch (error) {
      console.error('Error loading gift cards:', error);
    }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await giftCardAPI.createGiftCard({
        ownerId: user.id,
        initialBalance: parseFloat(purchaseForm.amount),
        validityMonths: 12
      });
      alert(`Gift Card purchased successfully!\nCard Code: ${response.data.cardCode}\nAmount: $${response.data.currentBalance}`);
      setShowPurchaseForm(false);
      setPurchaseForm({
        ownerId: user.id,
        recipientName: '',
        recipientEmail: '',
        amount: '',
        message: ''
      });
      loadGiftCards();
      setActiveTab('cards');
    } catch (error) {
      alert(error.response?.data?.message || 'Error purchasing gift card');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await giftCardAPI.redeemGiftCard({
        cardCode: redeemForm.cardCode,
        accountNumber: redeemForm.accountNumber,
        description: `Deposited to account ${redeemForm.accountNumber}`
      });
      alert(`Gift card redeemed successfully!\nAmount: $${response.data.amount}\nDeposited to account: ${redeemForm.accountNumber}`);
      setShowRedeemForm(false);
      setRedeemForm({
        cardCode: '',
        accountNumber: '',
        userId: user.id
      });
      loadGiftCards();
    } catch (error) {
      alert(error.response?.data?.message || 'Error redeeming gift card');
    } finally {
      setLoading(false);
    }
  };

  const copyCardCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('Card code copied to clipboard!');
  };

  return (
    <div>
      <div className="boa-page-header">
        <h1 className="boa-page-title">Gift Cards</h1>
        <p className="boa-page-subtitle">Purchase and manage gift cards</p>
      </div>

      {/* Tabs */}
      <div className="boa-card" style={{ marginBottom: '24px' }}>
        <div className="boa-tabs">
          <button 
            className={`boa-tab ${activeTab === 'cards' ? 'active' : ''}`}
            onClick={() => setActiveTab('cards')}
          >
            My Gift Cards ({giftCards.length})
          </button>
          <button 
            className={`boa-tab ${activeTab === 'purchase' ? 'active' : ''}`}
            onClick={() => { setActiveTab('purchase'); setShowPurchaseForm(true); }}
          >
            Purchase Gift Card
          </button>
          <button 
            className={`boa-tab ${activeTab === 'redeem' ? 'active' : ''}`}
            onClick={() => { setActiveTab('redeem'); setShowRedeemForm(true); }}
          >
            Redeem Gift Card
          </button>
        </div>
      </div>

      {/* My Gift Cards Tab */}
      {activeTab === 'cards' && (
        <>
          {giftCards.length > 0 ? (
            <div className="boa-dashboard-grid boa-dashboard-grid-3">
              {giftCards.map(card => (
                <div key={card.id} className="boa-account-card" style={{ background: 'linear-gradient(135deg, #e31c37 0%, #c41e3a 100%)', color: 'white' }}>
                  <div className="boa-account-header">
                    <div className="boa-account-type">
                      <h4 style={{ color: 'white' }}>
                        <MdCardGiftcard style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Gift Card
                      </h4>
                      <span 
                        className={`boa-status-${card.isActive ? 'active' : 'inactive'}`}
                        style={{ 
                          background: card.isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
                          color: card.isActive ? '#065f46' : '#991b1b',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}
                      >
                        {card.isActive ? 'Active' : 'Used'}
                      </span>
                    </div>
                  </div>
                  <div className="boa-account-details">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <p style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: '600', margin: 0, color: 'white' }}>
                        {card.cardCode}
                      </p>
                      <button 
                        onClick={() => copyCardCode(card.cardCode)}
                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                      >
                        <MdAssignment style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      </button>
                    </div>
                    <h2 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: 0, padding: 0 }}>
                      ${parseFloat(card.currentBalance).toFixed(2)}
                    </h2>
                    {card.recipientName && (
                      <p style={{ fontSize: '13px', marginTop: '8px', opacity: 0.9 }}>
                        To: {card.recipientName}
                      </p>
                    )}
                    {card.message && (
                      <p style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8, fontStyle: 'italic' }}>
                        "{card.message}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="boa-empty-state">
              <div className="boa-empty-icon">
                <MdCardGiftcard />
              </div>
              <h3>No Gift Cards Yet</h3>
              <p>Purchase a gift card for yourself or someone special</p>
              <button 
                className="boa-button"
                onClick={() => { setActiveTab('purchase'); setShowPurchaseForm(true); }}
              >
                Purchase Gift Card
              </button>
            </div>
          )}
        </>
      )}

      {/* Purchase Gift Card Tab */}
      {activeTab === 'purchase' && showPurchaseForm && (
        <div className="boa-card">
          <div className="boa-card-header">
            <h3>Purchase Gift Card</h3>
            <p style={{ color: 'var(--boa-gray-600)', fontSize: '14px', marginTop: '8px' }}>
              Gift cards can be used for purchases or sent to friends and family
            </p>
          </div>
          <div className="boa-card-body">
            <form onSubmit={handlePurchase} className="boa-form">
              <div className="boa-form-row">
                <div className="boa-form-group">
                  <label className="boa-label">Amount * (USD)</label>
                  <input
                    type="number"
                    className="boa-input"
                    value={purchaseForm.amount}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, amount: e.target.value })}
                    required
                    min="10"
                    max="500"
                    step="10"
                    placeholder="50"
                  />
                  <p style={{ fontSize: '12px', color: 'var(--boa-gray-600)', marginTop: '4px' }}>
                    Min: $10, Max: $500
                  </p>
                </div>
                <div className="boa-form-group">
                  <label className="boa-label">Recipient Name</label>
                  <input
                    type="text"
                    className="boa-input"
                    value={purchaseForm.recipientName}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, recipientName: e.target.value })}
                    placeholder="John Doe (optional)"
                  />
                </div>
              </div>
              <div className="boa-form-group">
                <label className="boa-label">Recipient Email</label>
                <input
                  type="email"
                  className="boa-input"
                  value={purchaseForm.recipientEmail}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, recipientEmail: e.target.value })}
                  placeholder="recipient@example.com (optional)"
                />
              </div>
              <div className="boa-form-group">
                <label className="boa-label">Personal Message</label>
                <textarea
                  className="boa-input"
                  value={purchaseForm.message}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, message: e.target.value })}
                  rows="3"
                  placeholder="Happy Birthday! Enjoy your gift..."
                />
              </div>
              <div className="boa-form-actions">
                <button 
                  type="button" 
                  className="boa-button-outline"
                  onClick={() => setShowPurchaseForm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="boa-button"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Purchase Gift Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Redeem Gift Card Tab */}
      {activeTab === 'redeem' && showRedeemForm && (
        <div className="boa-card">
          <div className="boa-card-header">
            <h3>Redeem Gift Card</h3>
            <p style={{ color: 'var(--boa-gray-600)', fontSize: '14px', marginTop: '8px' }}>
              Enter the gift card code to add funds to your account
            </p>
          </div>
          <div className="boa-card-body">
            <form onSubmit={handleRedeem} className="boa-form">
              <div className="boa-form-group">
                <label className="boa-label">Gift Card Code *</label>
                <input
                  type="text"
                  className="boa-input"
                  value={redeemForm.cardCode}
                  onChange={(e) => setRedeemForm({ ...redeemForm, cardCode: e.target.value.toUpperCase() })}
                  required
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  style={{ fontFamily: 'monospace', fontSize: '16px' }}
                />
              </div>
              <div className="boa-form-group">
                <label className="boa-label">Deposit to Account Number *</label>
                <input
                  type="text"
                  className="boa-input"
                  value={redeemForm.accountNumber}
                  onChange={(e) => setRedeemForm({ ...redeemForm, accountNumber: e.target.value })}
                  required
                  placeholder="Your account number"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
              <div className="boa-form-actions">
                <button 
                  type="button" 
                  className="boa-button-outline"
                  onClick={() => setShowRedeemForm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="boa-button"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Redeem Gift Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GiftCards;
