import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import api from './axios';
import './CarComparison.css';

const SPECS = [
  { id: 'price', label: 'Цена' },
  { id: 'brand', label: 'Марка' },
  { id: 'model', label: 'Модель' },
  { id: 'year', label: 'Год выпуска' },
  { id: 'mileage', label: 'Пробег' },
  { id: 'engine', label: 'Двигатель' },
  { id: 'horsepower', label: 'Мощность' },
  { id: 'transmission', label: 'Трансмиссия' },
  { id: 'drive_type', label: 'Привод' },
  { id: 'body_type', label: 'Тип кузова' }
];

function CarComparison() {
  const [cars, setCars] = useState([]);
  const [selectedCars, setSelectedCars] = useState([null, null]);
  const [isSelectingCar, setIsSelectingCar] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/cars');
        console.log('Fetched cars:', response.data); // Отладочный вывод
        setCars(response.data);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Ошибка при загрузке автомобилей');
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleAddCar = (slot) => {
    console.log('Opening selector for slot:', slot); // Отладочный вывод
    setSelectedSlot(slot);
    setIsSelectingCar(true);
  };

  const handleSelectCar = (car) => {
    console.log('Selecting car:', car, 'for slot:', selectedSlot); // Отладочный вывод
    
    setSelectedCars(prevCars => {
      const newCars = [...prevCars];
      newCars[selectedSlot] = car;
      return newCars;
    });
    setIsSelectingCar(false);
  };

  const handleRemoveCar = (slot) => {
    const newSelectedCars = [...selectedCars];
    newSelectedCars[slot] = null;
    setSelectedCars(newSelectedCars);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const CarColumn = ({ slot }) => {
    const car = selectedCars[slot];
    const otherCar = selectedCars[slot === 0 ? 1 : 0]; // Добавляем получение другого автомобиля для сравнения
  
    // Добавляем функцию сравнения значений
    const compareValues = (spec, value) => {
      if (!otherCar || !value || !otherCar[spec.id]) return '';
      
      switch(spec.id) {
        case 'price':
          return value < otherCar[spec.id] ? 'better' : 'worse';
        case 'horsepower':
          const currentPower = parseInt(value);
          const otherPower = parseInt(otherCar[spec.id]);
          return currentPower > otherPower ? 'better' : 'worse';
        case 'mileage':
          const currentMileage = parseInt(value);
          const otherMileage = parseInt(otherCar[spec.id]);
          return currentMileage < otherMileage ? 'better' : 'worse';
        default:
          return '';
      }
    };

    if (!car) {
      return (
        <div className="car-column empty">
          <button 
            className="add-car-button" 
            onClick={() => handleAddCar(slot)}
          >
            <FaPlus />
            <span>Добавить автомобиль</span>
          </button>
        </div>
      );
    }

    return (
    <div className="car-column">
      <div className="car-header">
        <img
          src={`/images/cars/${car.image_filename}`} 
          alt={`${car.brand} ${car.model}`}
          onError={(e) => e.target.src = '/images/cars/default.jpg'}
        />
        <button 
          className="remove-car" 
          onClick={() => handleRemoveCar(slot)}
        >
          <FaTimes />
        </button>
      </div>
      {SPECS.map(spec => (
        <div 
          className={`spec-value ${compareValues(spec, car[spec.id])}`} // Вот здесь добавляем класс для сравнения
          key={`${slot}-${spec.id}`}
          data-label={spec.label}
        >
          {spec.id === 'price' 
            ? `${formatNumber(car[spec.id])} ₽` 
            : car[spec.id]}
        </div>
      ))}
    </div>
  );
};

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="comparison-container">
      <h2>Сравнение автомобилей</h2>
      
      <div className="comparison-table">
        <div className="specs-column">
          <div className="header-placeholder">Характеристики</div>
          {SPECS.map(spec => (
            <div className="spec-label" key={spec.id}>{spec.label}</div>
          ))}
        </div>
        
        <CarColumn slot={0} />
        <CarColumn slot={1} />
      </div>

      {isSelectingCar && (
        <div className="car-selector-overlay">
          <div className="car-selector">
            <button 
              className="close-selector" 
              onClick={() => setIsSelectingCar(false)}
            >
              <FaTimes />
            </button>
            <h3>Выберите автомобиль</h3>
            <div className="car-grid">
              {cars.map(car => (
                <div
                  className="car-card"
                  key={car._id}
                  onClick={() => handleSelectCar(car)}
                >
                  <img
                    src={`/images/cars/${car.image_filename}`} 
                    alt={`${car.brand} ${car.model}`}
                    onError={(e) => e.target.src = '/images/cars/default.jpg'}
                  />
                  <h4>{car.brand} {car.model}</h4>
                  <p>{formatNumber(car.price)} ₽</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarComparison;