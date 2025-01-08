import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (formData.username === 'admin' && formData.password === 'admin') {
        console.log('Admin login attempt...'); // Проверяем попытку входа
        localStorage.clear(); // Очищаем старые данные
        localStorage.setItem('token', 'admin-token');
        localStorage.setItem('isAdmin', 'true'); // Убедимся, что записывается строка 'true'
        console.log('isAdmin value set:', localStorage.getItem('isAdmin')); // Проверяем значение

      }
      else {
        localStorage.setItem('isAdmin', 'false');
      }
      
      const response = await axios.post('http://localhost:3001/api/login', formData);
      console.log('Ответ сервера:', response.data);

      if (response.data.token) {
        // Сохраняем данные в localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('username', response.data.user.username);
        
        // Устанавливаем токен для будущих запросов
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Принудительно обновляем страницу и переходим на каталог
        window.location.href = '/catalog';
      }

    } catch (err) {
      console.error('Ошибка входа:', err);
      setError(err.response?.data?.message || 'Ошибка при входе в систему');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Вход в систему</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Имя пользователя"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Пароль"
            required
            className="form-input"
          />
        </div>

        <button type="submit" className="login-button">
          Войти
          <Link to="/catalog"></Link>
        </button>

        <div className="register-link">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;