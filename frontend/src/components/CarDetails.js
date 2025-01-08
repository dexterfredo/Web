import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './CarDetails.css';
import ContactForm from './ContactForm';

function CarDetails({ car, onClose }) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [formType, setFormType] = useState(null);

  const handleContactClick = (type) => {
    setFormType(type);
    setShowContactForm(true);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const handleFormSubmit = async (formData) => {
    try {
      // Здесь будет отправка данных на сервер
      console.log('Form submitted:', { ...formData, carId: car.id });
      // После успешной отправки закрываем форму
      setShowContactForm(false);
      alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
    } catch (err) {
      console.error('Error submitting form:', err);
      throw err;
    }
  };

  if (!car) return null;

  return (

    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="car-details-header">
          <img 
            src={`/images/cars/${car.image_filename}`} 
            alt={`${car.brand} ${car.model}`}
            onError={(e) => e.target.src = '/images/cars/default.jpg'}
          />
          <h2 className="car-details-title">{car.brand} {car.model}</h2>
        </div>

        <div className="car-details-grid">
          <div className="detail-item">
            <div className="detail-label">Год выпуска</div>
            <div className="detail-value">{car.year}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Цена</div>
            <div className="detail-value">{formatNumber(car.price)} ₽</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Двигатель</div>
            <div className="detail-value">{car.engine}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Мощность</div>
            <div className="detail-value">{car.horsepower} л.с.</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Трансмиссия</div>
            <div className="detail-value">{car.transmission}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Привод</div>
            <div className="detail-value">{car.drive_type}</div>
          </div>
        </div>

        <div className="car-description">
        <div className="description-title">Описание</div>
        <div className="description-text">
          {car.description || 'Премиальный гибридный кроссовер'}
        </div>
      </div>
      
        <div className="car-details-actions">
          <button 
            className="action-button contact-button"
            onClick={() => handleContactClick('contact')}
          >
            Связаться с менеджером
          </button>
          <button 
            className="action-button test-drive-button"
            onClick={() => handleContactClick('test-drive')}
          >
            Записаться на тест-драйв
          </button>
        </div>

        {showContactForm && (
          <ContactForm
            onSubmit={handleFormSubmit}
            onClose={() => setShowContactForm(false)}
            type={formType}
          />
        )}
      </div>
      </div>

  );
}

export default CarDetails;