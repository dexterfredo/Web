import React, { useState, useEffect } from 'react';
import api from './axios';
import './UserFavorites.css';

function UserFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get('/user/favorites');
        setFavorites(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Ошибка при загрузке избранного');
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFromFavorites = async (carId) => {
    try {
      await api.delete(`/user/favorites/${carId}`);
      setFavorites(favorites.filter(car => car.id !== carId));
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError('Ошибка при удалении из избранного');
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="favorites-container">
      <h2>Избранные автомобили</h2>
      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <p>У вас пока нет избранных автомобилей</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(car => (
            <div key={car.id} className="favorite-car-card">
              <div className="car-image-container">
                <img 
                  src={`/images/cars/${car.image_filename}`} 
                  alt={`${car.brand} ${car.model}`}
                  className="car-image"
                  onError={(e) => e.target.src = '/images/cars/default.jpg'}
                />
              </div>
              <div className="car-info">
                <h3>{car.brand} {car.model}</h3>
                <p className="car-year">Год: {car.year}</p>
                <p className="car-price">Цена: {car.price.toLocaleString()} ₽</p>
                <button
                  onClick={() => removeFromFavorites(car.id)}
                  className="remove-btn"
                >
                  Удалить из избранного
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserFavorites;