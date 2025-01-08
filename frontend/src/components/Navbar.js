import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCar, FaHeart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Отслеживание скролла для изменения стиля navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }
  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/catalog" className="navbar-logo">
          <FaCar className="logo-icon" />
          <span className="logo-text">AutoSalon</span>
        </Link>

        <div className="nav-links">
          <Link 
            to="/catalog" 
            className={`nav-link ${location.pathname === '/catalog' ? 'active' : ''}`}
          >
            Каталог
          </Link>
          <Link 
            to="/favorites" 
            className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
          >
            <FaHeart className="nav-icon" />
            Избранное
          </Link>
          <Link 
          to="/calculator" 
          className={`nav-link ${location.pathname === '/calculator' ? 'active' : ''}`}
        >
          Калькулятор
        </Link>
        <Link 
          to="/compare" 
          className={`nav-link ${location.pathname === '/compare' ? 'active' : ''}`}
        >
          Сравнение
        </Link>
        </div>

        <div className="nav-user">
          <div 
            className="user-menu-trigger"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <FaUser className="nav-icon" />
            <span className="username">Личный кабинет</span>
            {showUserMenu && (
              <div className="user-menu">
                <button className="menu-item" onClick={handleLogout}>
                  <FaSignOutAlt className="menu-icon" />
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;