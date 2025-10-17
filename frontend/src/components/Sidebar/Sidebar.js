import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import './Sidebar.css';

// Import modern vector icons
import { 
  MdDashboard,
  MdAccountBalance,
  MdSwapHoriz,
  MdCreditCard,
  MdCardGiftcard,
  MdHome,
  MdLock,
  MdLogout,
  MdChat,
  MdMenu,
  MdClose
} from 'react-icons/md';

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleChatbotClick = () => {
    // Trigger chatbot opening (you can implement this with a custom event or state)
    const event = new CustomEvent('openChatbot');
    window.dispatchEvent(event);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.boa-sidebar') && !event.target.closest('.boa-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [navigate]);

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        className="boa-menu-toggle" 
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <MdClose /> : <MdMenu />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="boa-sidebar-overlay show" onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
      <div className={`boa-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="boa-sidebar-header">
        </div>

        <nav className="boa-sidebar-nav">
          <div className="boa-nav-section">
            <NavLink to="/dashboard" className="boa-sidebar-nav-item" onClick={closeMobileMenu}>
              <span className="boa-nav-icon">
                <MdDashboard />
              </span>
              <span className="boa-nav-text">Dashboard</span>
            </NavLink>

            <NavLink to="/accounts" className="boa-sidebar-nav-item" onClick={closeMobileMenu}>
              <span className="boa-nav-icon">
                <MdAccountBalance />
              </span>
              <span className="boa-nav-text">Accounts</span>
            </NavLink>

            <NavLink to="/transactions" className="boa-sidebar-nav-item" onClick={closeMobileMenu}>
              <span className="boa-nav-icon">
                <MdSwapHoriz />
              </span>
              <span className="boa-nav-text">Transactions</span>
            </NavLink>

            <NavLink to="/credit-cards" className="boa-sidebar-nav-item" onClick={closeMobileMenu}>
              <span className="boa-nav-icon">
                <MdCreditCard />
              </span>
              <span className="boa-nav-text">Credit Cards</span>
            </NavLink>

            <NavLink to="/loans" className="boa-sidebar-nav-item" onClick={closeMobileMenu}>
              <span className="boa-nav-icon">
                <MdHome />
              </span>
              <span className="boa-nav-text">Loans</span>
            </NavLink>

            <NavLink to="/gift-cards" className="boa-sidebar-nav-item" onClick={closeMobileMenu}>
              <span className="boa-nav-icon">
                <MdCardGiftcard />
              </span>
              <span className="boa-nav-text">Gift Cards</span>
            </NavLink>

            <NavLink to="/lockers" className="boa-sidebar-nav-item" onClick={closeMobileMenu}>
              <span className="boa-nav-icon">
                <MdLock />
              </span>
              <span className="boa-nav-text">Lockers</span>
            </NavLink>

            <button onClick={() => { handleChatbotClick(); closeMobileMenu(); }} className="boa-sidebar-nav-item chatbot-menu-item">
              <span className="boa-nav-icon">
                <MdChat />
              </span>
              <span className="boa-nav-text">Banking Assistant</span>
              <span className="coming-soon-badge">Coming Soon</span>
            </button>
          </div>
        </nav>

        <div className="boa-sidebar-footer">
          <button onClick={handleLogout} className="boa-logout-btn">
            <span className="boa-nav-icon">
              <MdLogout />
            </span>
            <span className="boa-nav-text">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
