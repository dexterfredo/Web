import React, { useState,  useCallback } from 'react';
import './Calculator.css';
import Modal from './Modal';

function Calculator() {
    const [carPrice, setCarPrice] = useState(1000000);
    const [downPayment, setDownPayment] = useState(200000);
    const [term, setTerm] = useState(36);
    const [interestRate, setInterestRate] = useState(9.9);
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
      name: '',
      phone: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const calculateLoan = useCallback(() => {
      const principal = carPrice - downPayment;
      const monthlyRate = interestRate / 12 / 100;
      const monthlyPaymentAmount = 
        (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
        (Math.pow(1 + monthlyRate, term) - 1);
      
      setMonthlyPayment(Math.round(monthlyPaymentAmount));
      setTotalAmount(Math.round(monthlyPaymentAmount * term));
    }, [carPrice, downPayment, term, interestRate]);
  
    // Вызываем calculateLoan при изменении зависимостей
    React.useEffect(() => {
      calculateLoan();
    }, [calculateLoan]);
  
    const formatNumber = (num) => {
      return new Intl.NumberFormat('ru-RU').format(num);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const errors = {};
      
      if (!formData.name.trim()) {
        errors.name = 'Введите ваше имя';
      }
      
      if (!formData.phone.trim()) {
        errors.phone = 'Введите номер телефона';
      } else if (!/^\+?[0-9]{10,12}$/.test(formData.phone.replace(/\D/g, ''))) {
        errors.phone = 'Введите корректный номер телефона';
      }
  
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
  
      setIsSubmitting(true);
  
      try {
        // Имитация отправки данных
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
        setIsModalOpen(false);
        setFormData({ name: '', phone: '' });
        setFormErrors({});
      } catch (error) {
        alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
      } finally {
        setIsSubmitting(false);
      }
    };
  

  return (
    <div className="calculator-container">
      <h2>Кредитный калькулятор</h2>
      <div className="calculator-grid">
        <div className="calculator-inputs">
          <div className="input-group">
            <label>Стоимость автомобиля</label>
            <div className="range-input">
              <input
                type="range"
                min="100000"
                max="10000000"
                step="50000"
                value={carPrice}
                onChange={(e) => setCarPrice(Number(e.target.value))}
              />
              <input
                type="number"
                value={carPrice}
                onChange={(e) => setCarPrice(Number(e.target.value))}
              />
              <span className="currency">₽</span>
            </div>
          </div>

          <div className="input-group">
            <label>Первоначальный взнос</label>
            <div className="range-input">
              <input
                type="range"
                min="0"
                max={carPrice * 0.9}
                step="10000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
              />
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
              />
              <span className="currency">₽</span>
            </div>
            <span className="percent">
              {Math.round((downPayment / carPrice) * 100)}%
            </span>
          </div>

          <div className="input-group">
            <label>Срок кредита</label>
            <div className="range-input">
              <input
                type="range"
                min="12"
                max="84"
                step="12"
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
              />
              <input
                type="number"
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
              />
              <span className="period">мес.</span>
            </div>
          </div>

          <div className="input-group">
            <label>Процентная ставка</label>
            <div className="range-input">
              <input
                type="range"
                min="5"
                max="20"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
              <span className="percent">%</span>
            </div>
          </div>
        </div>

        <div className="calculator-results">
          <div className="result-item">
            <h3>Ежемесячный платеж</h3>
            <p className="amount">{formatNumber(monthlyPayment)} ₽</p>
          </div>
          <div className="result-item">
            <h3>Сумма кредита</h3>
            <p>{formatNumber(carPrice - downPayment)} ₽</p>
          </div>
          <div className="result-item">
            <h3>Общая сумма выплат</h3>
            <p>{formatNumber(totalAmount)} ₽</p>
          </div>
          <div className="result-item">
            <h3>Переплата</h3>
            <p>{formatNumber(totalAmount - (carPrice - downPayment))} ₽</p>
          </div>
          <button 
            className="apply-button" 
            onClick={() => setIsModalOpen(true)}
          >
            Оформить кредит
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="loan-application">
          <h3>Оформление заявки на кредит</h3>
          <div className="loan-details">
            <p>Сумма кредита: {formatNumber(carPrice - downPayment)} ₽</p>
            <p>Ежемесячный платеж: {formatNumber(monthlyPayment)} ₽</p>
            <p>Срок: {term} месяцев</p>
          </div>
          <form onSubmit={handleSubmit} className="loan-form">
            <div className="form-group">
              <label>Ваше имя</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setFormErrors({ ...formErrors, name: '' });
                }}
                placeholder="Иван Иванов"
                className={formErrors.name ? 'error' : ''}
              />
              {formErrors.name && <span className="error-message">{formErrors.name}</span>}
            </div>
            <div className="form-group">
              <label>Номер телефона</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  setFormErrors({ ...formErrors, phone: '' });
                }}
                placeholder="+7 (999) 999-99-99"
                className={formErrors.phone ? 'error' : ''}
              />
              {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
            </div>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default Calculator;