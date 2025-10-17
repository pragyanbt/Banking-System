import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { lockerAPI } from '../../services/api';
import { MdLock, MdAccountBalance, MdInventory } from 'react-icons/md';
import '../Dashboard/Dashboard.css';

function Lockers() {
  const { user } = useSelector(state => state.auth);
  const [lockers, setLockers] = useState([]);
  const [availableLockers, setAvailableLockers] = useState([]);
  const [activeTab, setActiveTab] = useState('lockers');
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [rentalForm, setRentalForm] = useState({
    userId: user?.id || '',
    lockerSize: 'SMALL',
    branchLocation: 'Main Branch - New York'
  });

  useEffect(() => {
    if (user) {
      loadLockers();
      loadAvailableLockers();
      setRentalForm(prev => ({ ...prev, userId: user.id }));
    }
  }, [user]);

  const loadLockers = async () => {
    try {
      const response = await lockerAPI.getLockersByUser(user.id);
      setLockers(response.data);
    } catch (error) {
      console.error('Error loading lockers:', error);
    }
  };

  const loadAvailableLockers = async () => {
    try {
      const response = await lockerAPI.getAvailableLockers();
      setAvailableLockers(response.data);
    } catch (error) {
      console.error('Error loading available lockers:', error);
    }
  };

  const handleRental = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await lockerAPI.allocateLocker(rentalForm);
      alert(`Locker rented successfully!\nLocker Number: ${response.data.lockerNumber}\nAnnual Fee: $${response.data.annualFee}`);
      setShowRentalForm(false);
      setRentalForm({
        userId: user.id,
        lockerSize: 'SMALL',
        branchLocation: 'Main Branch - New York'
      });
      loadLockers();
      loadAvailableLockers();
      setActiveTab('lockers');
    } catch (error) {
      alert(error.response?.data?.message || 'Error renting locker');
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async (lockerNumber) => {
    if (!window.confirm('Are you sure you want to release this locker?')) return;
    
    try {
      await lockerAPI.releaseLocker(lockerNumber);
      alert('Locker released successfully!');
      loadLockers();
      loadAvailableLockers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error releasing locker');
    }
  };

  const handleRenew = async (lockerNumber) => {
    if (!window.confirm('Renew this locker for another year?')) return;
    
    try {
      await lockerAPI.renewLocker(lockerNumber);
      alert('Locker renewed successfully!');
      loadLockers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error renewing locker');
    }
  };

  const getLockerIcon = (size) => {
    switch(size) {
      case 'SMALL': return <MdInventory style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      case 'MEDIUM': return <MdInventory style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      case 'LARGE': return <MdInventory style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      case 'EXTRA_LARGE': return <MdAccountBalance style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
      default: return <MdLock style={{ fontSize: '16px', verticalAlign: 'middle' }} />;
    }
  };

  const getLockerFee = (size) => {
    const fees = {
      'SMALL': 50,
      'MEDIUM': 100,
      'LARGE': 200,
      'EXTRA_LARGE': 350
    };
    return fees[size] || 100;
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'ALLOCATED': 'success',
      'AVAILABLE': 'info',
      'MAINTENANCE': 'warning'
    };
    return `boa-status-${statusColors[status] || 'secondary'}`;
  };

  return (
    <div>
      <div className="boa-page-header">
        <h1 className="boa-page-title">Lockers</h1>
        <p className="boa-page-subtitle">Secure locker services for your valuables</p>
      </div>

      {/* Tabs */}
      <div className="boa-card" style={{ marginBottom: '24px' }}>
        <div className="boa-tabs">
          <button 
            className={`boa-tab ${activeTab === 'lockers' ? 'active' : ''}`}
            onClick={() => setActiveTab('lockers')}
          >
            My Lockers ({lockers.length})
          </button>
          <button 
            className={`boa-tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available ({availableLockers.length})
          </button>
          <button 
            className={`boa-tab ${activeTab === 'rent' ? 'active' : ''}`}
            onClick={() => { setActiveTab('rent'); setShowRentalForm(true); }}
          >
            Rent a Locker
          </button>
        </div>
      </div>

      {/* My Lockers Tab */}
      {activeTab === 'lockers' && (
        <>
          {lockers.length > 0 ? (
            <div className="boa-dashboard-grid boa-dashboard-grid-2">
              {lockers.map(locker => (
                <div key={locker.id} className="boa-account-card">
                  <div className="boa-account-header">
                    <div className="boa-account-type">
                      <h4>{getLockerIcon(locker.lockerSize)} {locker.lockerSize} Locker</h4>
                      <span className={getStatusBadge(locker.lockerStatus)}>
                        {locker.lockerStatus}
                      </span>
                    </div>
                  </div>
                  <div className="boa-account-details">
                    <p style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                      {locker.lockerNumber}
                    </p>
                    <div style={{ padding: '12px', background: 'var(--boa-gray-50)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--boa-gray-600)' }}>Annual Fee:</span>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>${parseFloat(locker.annualFee).toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--boa-gray-600)' }}>Location:</span>
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>{locker.branchLocation}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--boa-gray-600)' }}>Allocated:</span>
                        <span style={{ fontSize: '13px' }}>{locker.allocationDate ? new Date(locker.allocationDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', color: 'var(--boa-gray-600)' }}>Expires:</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: locker.expiryDate && new Date(locker.expiryDate) < new Date() ? 'var(--boa-danger)' : 'var(--boa-success)' }}>
                          {locker.expiryDate ? new Date(locker.expiryDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="boa-account-actions">
                    <button 
                      className="boa-button"
                      onClick={() => handleRenew(locker.lockerNumber)}
                      disabled={locker.lockerStatus !== 'ALLOCATED'}
                    >
                      Renew
                    </button>
                    <button 
                      className="boa-button-outline boa-button-danger"
                      onClick={() => handleRelease(locker.lockerNumber)}
                      disabled={locker.lockerStatus !== 'ALLOCATED'}
                    >
                      Release
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="boa-empty-state">
              <div className="boa-empty-icon">
                <MdLock />
              </div>
              <h3>No Lockers Rented</h3>
              <p>Rent a secure locker to store your valuables</p>
              <button 
                className="boa-button"
                onClick={() => { setActiveTab('rent'); setShowRentalForm(true); }}
              >
                Rent a Locker
              </button>
            </div>
          )}
        </>
      )}

      {/* Available Lockers Tab */}
      {activeTab === 'available' && (
        <>
          {availableLockers.length > 0 ? (
            <div className="boa-card">
              <div className="boa-table-container">
                <table className="boa-table">
                  <thead>
                    <tr>
                      <th>Locker Number</th>
                      <th>Size</th>
                      <th>Location</th>
                      <th>Annual Fee</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableLockers.map(locker => (
                      <tr key={locker.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                          {locker.lockerNumber}
                        </td>
                        <td>{getLockerIcon(locker.lockerSize)} {locker.lockerSize}</td>
                        <td>{locker.branchLocation}</td>
                        <td style={{ fontWeight: '600' }}>${parseFloat(locker.annualFee).toFixed(2)}</td>
                        <td>
                          <span className={getStatusBadge(locker.lockerStatus)}>
                            {locker.lockerStatus}
                          </span>
                        </td>
                        <td>
                          {locker.lockerStatus === 'AVAILABLE' && (
                            <button 
                              className="boa-button-small"
                              onClick={() => {
                                setRentalForm({
                                  ...rentalForm,
                                  lockerSize: locker.lockerSize,
                                  branchLocation: locker.branchLocation
                                });
                                setActiveTab('rent');
                                setShowRentalForm(true);
                              }}
                            >
                              Rent This
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
                <MdInventory />
              </div>
              <h3>No Available Lockers</h3>
              <p>All lockers are currently allocated. Please check back later.</p>
            </div>
          )}
        </>
      )}

      {/* Rent a Locker Tab */}
      {activeTab === 'rent' && showRentalForm && (
        <div className="boa-card">
          <div className="boa-card-header">
            <h3>Rent a Locker</h3>
            <p style={{ color: 'var(--boa-gray-600)', fontSize: '14px', marginTop: '8px' }}>
              Select a locker size and location to rent
            </p>
          </div>
          <div className="boa-card-body">
            <form onSubmit={handleRental} className="boa-form">
              <div className="boa-form-group">
                <label className="boa-label">Locker Size *</label>
                <select
                  className="boa-input"
                  value={rentalForm.lockerSize}
                  onChange={(e) => setRentalForm({ ...rentalForm, lockerSize: e.target.value })}
                  required
                >
                  <option value="SMALL">Small - $50/year (5" x 5" x 24")</option>
                  <option value="MEDIUM">Medium - $100/year (5" x 10" x 24")</option>
                  <option value="LARGE">Large - $200/year (10" x 10" x 24")</option>
                  <option value="EXTRA_LARGE">Extra Large - $350/year (10" x 15" x 24")</option>
                </select>
              </div>
              <div className="boa-form-group">
                <label className="boa-label">Branch Location *</label>
                <select
                  className="boa-input"
                  value={rentalForm.branchLocation}
                  onChange={(e) => setRentalForm({ ...rentalForm, branchLocation: e.target.value })}
                  required
                >
                  <option value="Main Branch - New York">Main Branch - New York</option>
                  <option value="Downtown Branch - Manhattan">Downtown Branch - Manhattan</option>
                  <option value="Uptown Branch - Brooklyn">Uptown Branch - Brooklyn</option>
                  <option value="Midtown Branch - Queens">Midtown Branch - Queens</option>
                </select>
              </div>
              <div style={{ background: 'var(--boa-gray-50)', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '15px' }}>Summary</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px' }}>Size:</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{rentalForm.lockerSize}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px' }}>Location:</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{rentalForm.branchLocation}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--boa-gray-300)' }}>
                  <span style={{ fontSize: '15px', fontWeight: '600' }}>Annual Fee:</span>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--boa-success)' }}>
                    ${getLockerFee(rentalForm.lockerSize).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="boa-form-actions">
                <button 
                  type="button" 
                  className="boa-button-outline"
                  onClick={() => setShowRentalForm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="boa-button"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Rent Locker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Lockers;
