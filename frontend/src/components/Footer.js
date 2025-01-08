import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <FaCar className="footer-logo-icon" />
            <span className="footer-logo-text">AutoSalon</span>
          </div>
          <p className="footer-description">
            Ваш надежный партнер в выборе автомобиля. Лучшие предложения и профессиональный сервис.
          </p>
        </div>

        <div className="footer-section">
          <h3>Навигация</h3>
          <ul className="footer-links">
            <li><Link to="/catalog">Каталог</Link></li>
            <li><Link to="/favorites">Избранное</Link></li>
            <li><Link to="/about">О нас</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Контакты</h3>
          <ul className="footer-contacts">
            <li>
              <FaPhone />
              <span>+7 (999) 123-45-67</span>
            </li>
            <li>
              <FaEnvelope />
              <span>info@autosalon.com</span>
            </li>
            <li>
              <FaMapMarkerAlt />
              <span>г. Москва, ул. Автомобильная, 1</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Мы в соцсетях</h3>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AutoSalon. Все права защищены.</p>
      </div>
    </footer>
  );
}

export default Footer;