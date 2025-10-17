import axios from 'axios';

// Create individual API clients for each service
const authAPIClient = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

const transactionAPIClient = axios.create({
  baseURL: 'http://localhost:8082',
  headers: {
    'Content-Type': 'application/json',
  },
});

const creditCardAPIClient = axios.create({
  baseURL: 'http://localhost:8083',
  headers: {
    'Content-Type': 'application/json',
  },
});

const giftCardAPIClient = axios.create({
  baseURL: 'http://localhost:8084',
  headers: {
    'Content-Type': 'application/json',
  },
});

const loanAPIClient = axios.create({
  baseURL: 'http://localhost:8085',
  headers: {
    'Content-Type': 'application/json',
  },
});

const lockerAPIClient = axios.create({
  baseURL: 'http://localhost:8086',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests for all APIs
const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

[authAPIClient, transactionAPIClient, creditCardAPIClient, giftCardAPIClient, loanAPIClient, lockerAPIClient].forEach(api => {
  api.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
});

// Auth API
export const authAPIEndpoints = {
  login: (credentials) => authAPIClient.post('/api/auth/login', credentials),
  signup: (userData) => authAPIClient.post('/api/auth/signup', userData),
  getCurrentUser: () => authAPIClient.get('/api/auth/me'),
};

// Account API
export const accountAPI = {
  createAccount: (data) => transactionAPIClient.post('/api/accounts', data),
  getAccount: (accountNumber) => transactionAPIClient.get(`/api/accounts/${accountNumber}`),
  getAccountsByUser: (userId) => transactionAPIClient.get(`/api/accounts/user/${userId}`),
  getAllAccounts: () => transactionAPIClient.get('/api/accounts'),
  
  // Application endpoints
  submitApplication: (data) => transactionAPIClient.post('/api/accounts/applications', data),
  getApplicationsByUser: (userId) => transactionAPIClient.get(`/api/accounts/applications/user/${userId}`),
  getApplication: (applicationNumber) => transactionAPIClient.get(`/api/accounts/applications/${applicationNumber}`),
  createAccountFromApplication: (applicationNumber) => transactionAPIClient.post(`/api/accounts/applications/${applicationNumber}/create-account`),
  getApplicationsByStatus: (status) => transactionAPIClient.get(`/api/accounts/applications/status/${status}`), // For admin
  reviewApplication: (data) => transactionAPIClient.put('/api/accounts/applications/review', data), // For admin
};

// Transaction API
export const transactionAPIEndpoints = {
  deposit: (data) => transactionAPIClient.post('/api/transactions/deposit', data),
  withdraw: (data) => transactionAPIClient.post('/api/transactions/withdraw', data),
  transfer: (data) => transactionAPIClient.post('/api/transactions/transfer', data),
  getTransactionsByAccount: (accountNumber) => transactionAPIClient.get(`/api/transactions/account/${accountNumber}`),
  getAllTransactions: () => transactionAPIClient.get('/api/transactions'),
};

// Credit Card API
export const creditCardAPIEndpoints = {
  createCard: (data) => creditCardAPIClient.post('/api/credit-cards', data),
  makePurchase: (data) => creditCardAPIClient.post('/api/credit-cards/purchase', data),
  makePayment: (data) => creditCardAPIClient.post('/api/credit-cards/payment', data),
  getCard: (cardNumber) => creditCardAPIClient.get(`/api/credit-cards/${cardNumber}`),
  getCardsByUser: (userId) => creditCardAPIClient.get(`/api/credit-cards/user/${userId}`),
  getTransactions: (cardNumber) => creditCardAPIClient.get(`/api/credit-cards/${cardNumber}/transactions`),
  blockCard: (cardNumber) => creditCardAPIClient.put(`/api/credit-cards/${cardNumber}/block`),
  unblockCard: (cardNumber) => creditCardAPIClient.put(`/api/credit-cards/${cardNumber}/unblock`),
  
  // Application endpoints
  applyForCard: (data) => creditCardAPIClient.post('/api/credit-cards/applications', data),
  getApplicationsByUser: (userId) => creditCardAPIClient.get(`/api/credit-cards/applications/user/${userId}`),
  getApplication: (applicationNumber) => creditCardAPIClient.get(`/api/credit-cards/applications/${applicationNumber}`),
  issueCard: (applicationNumber) => creditCardAPIClient.post(`/api/credit-cards/applications/${applicationNumber}/issue-card`),
};

// Gift Card API
export const giftCardAPIEndpoints = {
  createGiftCard: (data) => giftCardAPIClient.post('/api/gift-cards', data),
  redeemGiftCard: (data) => giftCardAPIClient.post('/api/gift-cards/redeem', data),
  getGiftCard: (cardCode) => giftCardAPIClient.get(`/api/gift-cards/${cardCode}`),
  getGiftCardsByOwner: (ownerId) => giftCardAPIClient.get(`/api/gift-cards/owner/${ownerId}`),
};

// Loan API
export const loanAPIEndpoints = {
  applyForLoan: (data) => loanAPIClient.post('/api/loans/applications', data),
  getApplicationsByUser: (userId) => loanAPIClient.get(`/api/loans/applications/user/${userId}`),
  getApplication: (applicationNumber) => loanAPIClient.get(`/api/loans/applications/${applicationNumber}`),
  disburseLoan: (applicationNumber) => loanAPIClient.post(`/api/loans/applications/${applicationNumber}/disburse`),
  makePayment: (data) => loanAPIClient.post('/api/loans/payment', data),
  getLoan: (loanNumber) => loanAPIClient.get(`/api/loans/${loanNumber}`),
  getLoansByUser: (userId) => loanAPIClient.get(`/api/loans/user/${userId}`),
  getPayments: (loanNumber) => loanAPIClient.get(`/api/loans/${loanNumber}/payments`),
  getApplicationsByStatus: (status) => loanAPIClient.get(`/api/loans/applications/status/${status}`), // For admin
  reviewApplication: (data) => loanAPIClient.put('/api/loans/applications/review', data), // For admin
};

// Locker API
export const lockerAPIEndpoints = {
  allocateLocker: (data) => lockerAPIClient.post('/api/lockers', data),
  renewLocker: (lockerNumber) => lockerAPIClient.put(`/api/lockers/${lockerNumber}/renew`),
  releaseLocker: (lockerNumber) => lockerAPIClient.put(`/api/lockers/${lockerNumber}/release`),
  getLocker: (lockerNumber) => lockerAPIClient.get(`/api/lockers/${lockerNumber}`),
  getLockersByUser: (userId) => lockerAPIClient.get(`/api/lockers/user/${userId}`),
  getAvailableLockers: () => lockerAPIClient.get('/api/lockers/available'),
};

// Legacy exports for backward compatibility
export const authAPI = authAPIEndpoints;
export const transactionAPI = transactionAPIEndpoints;
export const creditCardAPI = creditCardAPIEndpoints;
export const giftCardAPI = giftCardAPIEndpoints;
export const loanAPI = loanAPIEndpoints;
export const lockerAPI = lockerAPIEndpoints;

