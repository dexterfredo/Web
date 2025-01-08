import React, { useState } from 'react';
import './ContactForm.css';

function ContactForm({ onSubmit, onClose, type }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Валидация телефона
    const phoneRegex = /^\+?[0-9]{10,12}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setError('Пожалуйста, введите корректный номер телефона');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        type: type // 'contact' или 'test-drive'
      });
      onClose();
    } catch (err) {
      setError('Произошла ошибка при отправке формы');
    }
  };

  return (
    <div className="contact-form-overlay" onClick={onClose}>
      <div className="contact-form-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <h3>{type === 'contact' ? 'Связаться с менеджером' : 'Записаться на тест-драйв'}</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ваше имя"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ваш телефон"
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="submit-button">
            Подтвердить
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;