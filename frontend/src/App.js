import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import AuthInitializer from './components/Auth/AuthInitializer';
import './App.css';

// Components
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import Accounts from './components/Accounts/Accounts';
import Transactions from './components/Transactions/Transactions';
import CreditCards from './components/CreditCards/CreditCards';
import GiftCards from './components/GiftCards/GiftCards';
import Loans from './components/Loans/Loans';
import Lockers from './components/Lockers/Lockers';
import Sidebar from './components/Sidebar/Sidebar';

// Admin Components
import AdminDashboard from './components/Admin/AdminDashboard';
import CreditCardReview from './components/Admin/CreditCardReview';
import LoanReview from './components/Admin/LoanReview';
import AccountReview from './components/Admin/AccountReview';
import AdminSidebar from './components/Admin/AdminSidebar';

// Chatbot Component
import Chatbot from './components/Chatbot/Chatbot';

// Bank of America Header Component
const BoAHeader = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <header className="boa-app-header">
      <div className="boa-header-main">
        <div className="boa-logo">
          <img src="/logo.svg" alt="Pragyan Bank of USA" />
        </div>
        <div className="boa-header-actions">
          {user && (
            <div className="boa-user-menu">
              <div className="boa-user-avatar">
                {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="boa-user-name">
                {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Bank of America Layout Component
const BoALayout = ({ children, isAdmin }) => {
  return (
    <div className="boa-main-layout">
      {isAdmin ? <AdminSidebar /> : <Sidebar />}
      <div className="boa-main-content">
        <div className="boa-content-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  // Check if user is admin
  const isAdmin = user?.roles?.some(role => 
    role.name === 'ROLE_ADMIN' || role === 'ROLE_ADMIN' || role === 'admin'
  );

  return (
    <Router>
      <AuthInitializer>
        <div className="App">
          {isAuthenticated && <BoAHeader />}
          <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={isAdmin ? "/admin/dashboard" : "/dashboard"} />} />
          <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
          
          {/* Customer Routes */}
          <Route path="/dashboard" element={isAuthenticated ? <BoALayout><Dashboard /></BoALayout> : <Navigate to="/login" />} />
          <Route path="/accounts" element={isAuthenticated ? <BoALayout><Accounts /></BoALayout> : <Navigate to="/login" />} />
          <Route path="/transactions" element={isAuthenticated ? <BoALayout><Transactions /></BoALayout> : <Navigate to="/login" />} />
          <Route path="/credit-cards" element={isAuthenticated ? <BoALayout><CreditCards /></BoALayout> : <Navigate to="/login" />} />
          <Route path="/gift-cards" element={isAuthenticated ? <BoALayout><GiftCards /></BoALayout> : <Navigate to="/login" />} />
          <Route path="/loans" element={isAuthenticated ? <BoALayout><Loans /></BoALayout> : <Navigate to="/login" />} />
          <Route path="/lockers" element={isAuthenticated ? <BoALayout><Lockers /></BoALayout> : <Navigate to="/login" />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={isAuthenticated && isAdmin ? <BoALayout isAdmin={true}><AdminDashboard /></BoALayout> : <Navigate to="/login" />} />
          <Route path="/admin/credit-cards" element={isAuthenticated && isAdmin ? <BoALayout isAdmin={true}><CreditCardReview /></BoALayout> : <Navigate to="/login" />} />
          <Route path="/admin/loans" element={isAuthenticated && isAdmin ? <BoALayout isAdmin={true}><LoanReview /></BoALayout> : <Navigate to="/login" />} />
          <Route path="/admin/accounts" element={isAuthenticated && isAdmin ? <BoALayout isAdmin={true}><AccountReview /></BoALayout> : <Navigate to="/login" />} />
          
          <Route path="/" element={<Navigate to={isAuthenticated ? (isAdmin ? "/admin/dashboard" : "/dashboard") : "/login"} />} />
          </Routes>
          
          {/* Chatbot - Only show for authenticated users */}
          {isAuthenticated && <Chatbot />}
        </div>
      </AuthInitializer>
    </Router>
  );
}

export default App;

