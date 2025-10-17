import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import '../Sidebar/Sidebar.css';

// Import modern vector icons
import { 
  MdDashboard,
  MdCreditCard,
  MdAttachMoney,
  MdAccountBalance,
  MdLogout
} from 'react-icons/md';

function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="boa-sidebar">
      <div className="boa-sidebar-header">
        <h2>Menu</h2>
      </div>

      <nav className="boa-sidebar-nav">
        <div className="boa-nav-section">
          <NavLink to="/admin/dashboard" className="boa-sidebar-nav-item">
            <span className="boa-nav-icon">
              <MdDashboard />
            </span>
            <span className="boa-nav-text">Admin Dashboard</span>
          </NavLink>

          <NavLink to="/admin/accounts" className="boa-sidebar-nav-item">
            <span className="boa-nav-icon">
              <MdAccountBalance />
            </span>
            <span className="boa-nav-text">Account Applications</span>
          </NavLink>

          <NavLink to="/admin/credit-cards" className="boa-sidebar-nav-item">
            <span className="boa-nav-icon">
              <MdCreditCard />
            </span>
            <span className="boa-nav-text">Credit Card Applications</span>
          </NavLink>

          <NavLink to="/admin/loans" className="boa-sidebar-nav-item">
            <span className="boa-nav-icon">
              <MdAttachMoney />
            </span>
            <span className="boa-nav-text">Loan Applications</span>
          </NavLink>

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
  );
}

export default AdminSidebar;

