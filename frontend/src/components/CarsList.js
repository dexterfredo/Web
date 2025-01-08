import React, { useState, useEffect, useCallback } from 'react';
import './CarsList.css';
import api from './axios';
import CarDetails from './CarDetails';
import AddCar from './AddCar';
import axios from 'axios';

function CarsList() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCars, setFilteredCars] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  // Проверяем статус админа
  const adminStatus = localStorage.getItem('isAdmin');
  const isAdmin = adminStatus === 'true';

 // Единая функция загрузки данных
 const fetchData = useCallback(async () => {
  try {
    const [carsResponse, favoritesResponse] = await Promise.all([
      api.get('/cars'),
      api.get('/user/favorites')
    ]);

    setCars(carsResponse.data);
    setFilteredCars(carsResponse.data);
    setUserFavorites(favoritesResponse.data.map(car => car.id));
    setLoading(false);
  } catch (err) {
    console.error('Error fetching data:', err);
    setError('Ошибка при загрузке данных');
    setLoading(false);
  }
}, []);

// Функция добавления автомобиля
const handleAddCar = useCallback(async () => {
  try {
    setShowAddModal(false); // Сначала закрываем модальное окно
    await fetchData(); // Затем обновляем данные
  } catch (error) {
    console.error('Error updating cars list:', error);
    setError('Ошибка при обновлении списка автомобилей');
  }
}, [fetchData]);

// Функция удаления автомобиля
const handleDeleteCar = async (carId) => {
  if (window.confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
    try {
      await api.delete(`/cars/${carId}`);
      // Обновляем список после удаления
      setCars(cars.filter(car => car.id !== carId));
      setFilteredCars(filteredCars.filter(car => car.id !== carId));
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Ошибка при удалении автомобиля');
    }
  }
};

// Функция редактирования автомобиля
const handleEditCar = (car) => {
  setEditingCar(car);
  setShowAddModal(true);
};

// Загрузка данных при монтировании компонента
useEffect(() => {
  fetchData();
}, [fetchData]);

// Фильтрация автомобилей
useEffect(() => {
  const filterCars = () => {
    const filtered = cars.filter(car => {
      const searchString = `${car.brand} ${car.model} ${car.year}`.toLowerCase();
      return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredCars(filtered);
  };
  filterCars();
}, [searchTerm, cars]);

useEffect(() => {
  const fetchCars = async () => {
    try {
      const response = await axios.get('/api/cars');
      console.log('Fetched cars:', response.data); // Для отладки
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  fetchCars();
}, []);

// Остальные функции
const handleCloseDetails = () => {
  setShowDetails(false);
  setSelectedCar(null);
};

const handleShowDetails = (car) => {
  setSelectedCar(car);
  setShowDetails(true);
};

const addToFavorites = async (carId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Необходимо авторизоваться');
      return;
    }

    // Убедимся, что carId передается как число
    const response = await api.post('/user/favorites', 
      { car_id: Number(carId) }, // Изменили carId на car_id
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 200 || response.status === 201) {
      console.log('Added to favorites:', carId);
      setUserFavorites(prev => [...prev, carId]);
    }
  } catch (err) {
    console.error('Error adding to favorites:', err);
    alert('Ошибка при добавлении в избранное: ' + (err.response?.data?.message || err.message));
  }
};

// Функция удаления из избранного
const removeFromFavorites = async (carId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Необходимо авторизоваться');
      return;
    }

    const response = await api.delete(`/user/favorites/${carId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      setUserFavorites(prev => prev.filter(id => id !== carId));
    }
  } catch (err) {
    console.error('Error removing from favorites:', err);
    alert('Ошибка при удалении из избранного');
  }
};

// Функция загрузки избранного
const fetchFavorites = useCallback(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await api.get('/user/favorites', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data) {
      console.log('Favorites loaded:', response.data);
      setUserFavorites(response.data.map(car => car.id));
    }
  } catch (err) {
    console.error('Error fetching favorites:', err);
  }
}, []);

 // Загрузка данных при монтировании
 useEffect(() => {
  const loadData = async () => {
    try {
      await Promise.all([
        fetchData(),
        fetchFavorites()
      ]);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };
  loadData();
}, [fetchData, fetchFavorites]);

const formatNumber = (num) => {
  return new Intl.NumberFormat('ru-RU').format(num);
};

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  

  // Отображение компонента
  return (
    <div className="cars-container">
    <h2 className="catalog-title">Каталог автомобилей</h2>
    {isAdmin && (
      <button 
        className="add-car-button"
        onClick={() => setShowAddModal(true)}
      >
        Добавить автомобиль
      </button>
    )}

    {showAddModal && (
      <AddCar
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddCar}
      />
    )}

    <div className="search-container">
      <input
        type="text"
        placeholder="Поиск автомобилей..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>

    {selectedCar && showDetails && (
      <CarDetails 
        car={selectedCar} 
        onClose={handleCloseDetails}
      />
    )}

    <div className="cars-grid">
      {filteredCars.map(car => (
        <div key={car.id} className="car-card">
            <div className="car-image-container ">
              <img 
                src={`/images/cars/${car.image_filename}`}
                alt={`${car.brand} ${car.model}`}
                className="car-image"
                onError={(e) => {
                  e.target.src = '/images/cars/default.jpg';
                  e.target.classList.add('error');
                }}
              />
            </div>
            <div className="car-info">
              <h3>{car.brand} {car.model}</h3>
              <p className="car-year">Год: {car.year}</p>
              <p className="car-price">Цена: {formatNumber(car.price)} ₽</p>
              <div className="car-actions">
              {!isAdmin ? (
                  <>
                    <button
                      className="details-btn"
                      onClick={() => handleShowDetails(car)}
                    >
                      Подробнее
                    </button>
                    {userFavorites.includes(car.id) ? (
                      <button
                        onClick={() => removeFromFavorites(car.id)}
                        className="remove-favorite-btn"
                      >
                        Удалить из избранного
                      </button>
                    ) : (
                      <button
                        onClick={() => addToFavorites(car.id)}
                        className="add-favorite-btn"
                      >
                        В избранное
                      </button>
                    )}
                  </>
                ) : (
                  <div className="admin-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditCar(car)}
                    >
                      Изменить
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteCar(car.id)}
                    >
                      Удалить
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {showAddModal && (
        <AddCar
          onClose={() => {
            setShowAddModal(false);
            setEditingCar(null);
          }}
          onSuccess={handleAddCar}
          editingCar={editingCar}
        />
      )}
      </div>
  );
}

export default CarsList;
