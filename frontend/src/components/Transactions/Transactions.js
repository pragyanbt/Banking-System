import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { transactionAPI, accountAPI } from '../../services/api';
import { MdAccountBalance, MdAssignment } from 'react-icons/md';
import Sidebar from '../Sidebar/Sidebar';
import '../Dashboard/Dashboard.css';

function Transactions() {
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('deposit');
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: ''
  });

  const loadAccounts = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await accountAPI.getAccountsByUser(user.id);
      setAccounts(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedAccount(response.data[0].accountNumber);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
      setAccounts([]);
    }
  }, [user?.id]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const loadTransactionHistory = useCallback(async (accountNumber) => {
    if (!accountNumber) return;
    try {
      const response = await transactionAPI.getTransactionsByAccount(accountNumber);
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    }
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      loadTransactionHistory(selectedAccount);
    }
  }, [selectedAccount, loadTransactionHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'deposit') {
        await transactionAPI.deposit({ 
          toAccount: formData.toAccount, 
          amount: parseFloat(formData.amount),
          transactionType: 'DEPOSIT',
          description: formData.description || 'Deposit to account'
        });
      } else if (activeTab === 'withdraw') {
        await transactionAPI.withdraw({ 
          fromAccount: formData.fromAccount, 
          amount: parseFloat(formData.amount),
          transactionType: 'WITHDRAWAL',
          description: formData.description || 'Withdrawal from account'
        });
      } else {
        await transactionAPI.transfer({
          fromAccount: formData.fromAccount,
          toAccount: formData.toAccount,
          amount: parseFloat(formData.amount),
          description: formData.description || 'Transfer between accounts'
        });
      }
      alert('Transaction successful! ✅');
      setFormData({ fromAccount: '', toAccount: '', amount: '', description: '' });
      loadAccounts();
      if (selectedAccount) {
        loadTransactionHistory(selectedAccount);
      }
    } catch (error) {
      console.error('Transaction error:', error);
      alert('Transaction failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="boa-page-header">
        <h1 className="boa-page-title">Transactions</h1>
        <p className="boa-page-subtitle">Deposit, withdraw, and transfer funds</p>
      </div>

      <div className="boa-card">
        <div className="boa-card-header">
          <h3>Transaction Services</h3>
        </div>
        <div className="boa-card-body">
          {accounts.length === 0 ? (
            <div className="boa-empty-state">
              <div className="boa-empty-icon">
                <MdAccountBalance />
              </div>
              <h3>No Accounts Found</h3>
              <p>Please create an account first to perform transactions</p>
              <button className="boa-button" onClick={() => window.location.href = '/accounts'}>
                Go to Accounts
              </button>
            </div>
          ) : (
            <>
              <div style={{display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--boa-gray-200)', paddingBottom: '12px'}}>
                <button 
                  className={activeTab === 'deposit' ? 'boa-button' : 'boa-button boa-button-outline'} 
                  onClick={() => setActiveTab('deposit')}
                >
                  Deposit
                </button>
                <button 
                  className={activeTab === 'withdraw' ? 'boa-button' : 'boa-button boa-button-outline'} 
                  onClick={() => setActiveTab('withdraw')}
                >
                  Withdraw
                </button>
                <button 
                  className={activeTab === 'transfer' ? 'boa-button' : 'boa-button boa-button-outline'} 
                  onClick={() => setActiveTab('transfer')}
                >
                  Transfer
                </button>
              </div>

              <form onSubmit={handleSubmit} className="boa-form">
            {activeTab === 'transfer' && (
              <div className="boa-form-group">
                <label className="boa-label">From Account</label>
                <select
                  className="boa-input"
                  value={formData.fromAccount}
                  onChange={e => setFormData({...formData, fromAccount: e.target.value})}
                  required
                >
                  <option value="">Select account</option>
                  {accounts.filter(acc => acc && acc.accountNumber).map(account => (
                    <option key={account.id} value={account.accountNumber}>
                      {account.accountType} - ****{account.accountNumber.slice(-4)} (${parseFloat(account.balance || 0).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {activeTab === 'withdraw' && (
              <div className="boa-form-group">
                <label className="boa-label">Account Number</label>
                <select
                  className="boa-input"
                  value={formData.fromAccount}
                  onChange={e => setFormData({...formData, fromAccount: e.target.value})}
                  required
                >
                  <option value="">Select account</option>
                  {accounts.filter(acc => acc && acc.accountNumber).map(account => (
                    <option key={account.id} value={account.accountNumber}>
                      {account.accountType} - ****{account.accountNumber.slice(-4)} (${parseFloat(account.balance || 0).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(activeTab === 'deposit' || activeTab === 'transfer') && (
              <div className="boa-form-group">
                <label className="boa-label">{activeTab === 'transfer' ? 'To Account' : 'Account Number'}</label>
                {activeTab === 'deposit' ? (
                  <select
                    className="boa-input"
                    value={formData.toAccount}
                    onChange={e => setFormData({...formData, toAccount: e.target.value})}
                    required
                  >
                    <option value="">Select account</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.accountNumber}>
                        {account.accountType} - ****{account.accountNumber.slice(-4)} (${parseFloat(account.balance).toFixed(2)})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="boa-input"
                    value={formData.toAccount}
                    onChange={e => setFormData({...formData, toAccount: e.target.value})}
                    placeholder="Enter recipient account number"
                    required
                  />
                )}
              </div>
            )}

            <div className="boa-form-group">
              <label className="boa-label">Amount</label>
              <input
                type="number"
                step="0.01"
                className="boa-input"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="boa-form-group">
              <label className="boa-label">Description (Optional)</label>
              <input
                type="text"
                className="boa-input"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Enter transaction description"
              />
            </div>

            <button type="submit" className="boa-button boa-button-large" disabled={loading}>
              {loading ? 'Processing...' : (activeTab === 'deposit' ? 'Deposit Funds' : activeTab === 'withdraw' ? 'Withdraw Funds' : 'Transfer Funds')}
            </button>
          </form>
            </>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="boa-card" style={{ marginTop: '24px' }}>
        <div className="boa-card-header">
          <h3>Transaction History</h3>
          {accounts.length > 0 && (
            <select
              className="boa-input"
              value={selectedAccount}
              onChange={e => setSelectedAccount(e.target.value)}
              style={{ maxWidth: '300px' }}
            >
              {accounts.filter(acc => acc && acc.accountNumber).map(account => (
                <option key={account.id} value={account.accountNumber}>
                  {account.accountType} - ****{account.accountNumber.slice(-4)}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="boa-card-body">
          {transactions.length === 0 ? (
            <div className="boa-empty-state">
              <div className="boa-empty-icon">
                <MdAssignment style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              </div>
              <h3>No Transactions Yet</h3>
              <p>Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="boa-table-container">
              <table className="boa-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>From Account</th>
                    <th>To Account</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{new Date(transaction.createdAt || transaction.transactionDate).toLocaleString()}</td>
                      <td>
                        <span className={`boa-badge boa-badge-${
                          transaction.transactionType === 'DEPOSIT' ? 'success' : 
                          (transaction.transactionType === 'WITHDRAW' || transaction.transactionType === 'WITHDRAWAL') ? 'warning' : 
                          'info'
                        }`}>
                          {transaction.transactionType}
                        </span>
                      </td>
                      <td>{transaction.description || 'N/A'}</td>
                      <td>{transaction.fromAccount || '-'}</td>
                      <td>{transaction.toAccount || '-'}</td>
                      <td style={{ 
                        color: (() => {
                          if (transaction.transactionType === 'DEPOSIT') return 'var(--boa-success)';
                          if (transaction.transactionType === 'WITHDRAW' || transaction.transactionType === 'WITHDRAWAL') return 'var(--boa-danger)';
                          if (transaction.transactionType === 'TRANSFER' && transaction.fromAccount === selectedAccount) return 'var(--boa-danger)';
                          if (transaction.transactionType === 'TRANSFER' && transaction.toAccount === selectedAccount) return 'var(--boa-success)';
                          return 'var(--boa-text)';
                        })(),
                        fontWeight: '600'
                      }}>
                        {(() => {
                          if (transaction.transactionType === 'WITHDRAW' || transaction.transactionType === 'WITHDRAWAL') return '-';
                          if (transaction.transactionType === 'TRANSFER' && transaction.fromAccount === selectedAccount) return '-';
                          return '+';
                        })()}
                        ${parseFloat(transaction.amount).toFixed(2)}
                      </td>
                      <td>
                        <span className={`boa-status-${(transaction.transactionStatus || transaction.status || 'pending').toLowerCase()}`}>
                          {transaction.transactionStatus || transaction.status || 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Transactions;

