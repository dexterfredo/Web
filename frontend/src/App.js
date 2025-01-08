import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate  } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CarsList from './components/CarsList';
import UserFavorites from './components/UserFavorites';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/about';
import Calculator from './components/Calculator';
import CarComparison from './components/CarComparison';
import AddCar from './components/AddCar';
import './App.css';


function AppContent() {
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
    console.log('Admin status:', adminStatus); // Отладочный лог
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/login');
    window.location.reload();
  };

  // Проверяем, находимся ли мы на странице логина или регистрации
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Если это админ, показываем только каталог
  if (isAdmin) {
    return (
      <div className="app">
        <div className="admin-header">
          <h1>Каталог автомобилей</h1>
          <button onClick={handleLogout} className="logout-btn">Выйти</button>
        </div>
        <main className="main-content">
          <Routes>
            <Route path="/catalog" element={<CarsList />} />
            <Route path="/admin/cars/add" element={<AddCar />} />
            <Route path="*" element={<CarsList />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      {isAuthenticated && <Navbar />}
      <main className={`main-content ${isAuthPage ? 'auth-page' : ''}`}>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/catalog" replace/>} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/catalog" replace/>} />
          <Route path="/catalog" element={isAuthenticated ? <CarsList  /> : <Navigate to="/login" replace/>} />
          <Route path="/favorites" element={isAuthenticated ? <UserFavorites  /> : <Navigate to="/login" replace/>} />
          <Route path="/About" element={isAuthenticated ? <About /> : <Navigate to="/login" replace/>} />
          <Route path="/calculator" element={isAuthenticated ? <Calculator /> : <Navigate to="/login" replace/>} />
          <Route path="/compare" element={isAuthenticated ? <CarComparison /> : <Navigate to="/login" replace/>} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/catalog" : "/login"} replace />}  />
        </Routes>
      </main>
      {/* Отображаем Footer только если пользователь авторизован и не находится на странице авторизации/регистрации */}
      {isAuthenticated && !isAuthPage && <Footer />}
    </div>
  );
}


// Основной компонент приложения
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;