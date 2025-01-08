import React, { useState, useEffect } from 'react';
import './AddCar.css';
import api from './axios';

function AddCar({onClose = () => {}, onSuccess = () => {}, editingCar = null }) {
    //данные машины
    const [formData, setFormData] = useState({
      brand: '',
      model: '', 
      year: '',
      price: '',
      mileage: '',
      engine: '',
      horsepower: '',
      transmission: '',
      drive_type: '',
      color: '',
      body_type: '',
      description: '',
      image: null 
    });

    // Заполняем форму данными редактируемого автомобиля
  useEffect(() => {
    if (editingCar) {
      // Преобразуем image_url из массива в строку, если он существует
      const formattedData = {
        ...editingCar,
        image_url: editingCar.image_url ? editingCar.image_url[0] : null
      };
      setFormData(formattedData);
    }
  }, [editingCar]);
  

    //добавление машины
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
          const formDataToSend = new FormData();
              // Добавляем все поля в FormData
              Object.keys(formData).forEach(key => {
                if (key === 'image' && formData[key]) {
                  formDataToSend.append('image', formData[key]);
                  // Формируем правильный путь для image_url
                  formDataToSend.append('image_url', `/images/cars/${formData[key].name}`);
                  formDataToSend.append('image_filename', formData[key].name);
                } else if (key !== 'image') {
                  formDataToSend.append(key, formData[key]);
                }
              });

   
            //получение токена
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Не авторизован');
              }

              let response;
              if (editingCar) {
                // Если редактируем существующий автомобиль
                response = await api.put(`/cars/${editingCar.id}`, formDataToSend, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                  }
                });
              } else {
                // Если добавляем новый автомобиль
                response = await api.post('/cars', formDataToSend, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                  }
                });
              }
      
            if (response.status === 201 || response.status === 200) {
                console.log('Car added successfully:', response.data);
                onSuccess();
                onClose();
            }
          } catch (error) {
            console.error('Error adding car:', error);
            alert('Ошибка при добавлении автомобиля: ' + (error.response?.data?.message || error.message));
          }
        };
      
      //изменение данных машины
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

      //изменение изображения машины
      const handleImageChange = (e) => {
  if (e.target.files[0]) {
    const file = e.target.files[0];
    setFormData(prevState => ({
      ...prevState,
      image: file,
      image_url: `/images/cars/${file.name}` // Добавляем image_url при выборе файла
    }));
  }
      };

      return (
        <div className="add-car-modal">
          <div className="modal-content">
          <h2>{editingCar ? 'Редактировать автомобиль' : 'Добавить новый автомобиль'}</h2>
          <form onSubmit={handleSubmit} className="add-car-form">
            {/* Марка */}
            <div className="form-grid">
            <div className="form-group">
              <label className="required-field">Марка</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>

            {/* Модель */}            
            <div className="form-group">
              <label className="required-field">Модель</label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>

            {/* Год */}            
            <div className="form-group">
              <label className="required-field">Год</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            {/* Цена */}
            <div className="form-group">
              <label className="required-field">Цена</label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
            />
            </div>
          
          {/* Пробег */}
          <div className="form-group">
              <label className="required-field">Пробег</label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                min="0"
                value={formData.mileage}
                onChange={handleChange}
                required
            />
            </div>

            {/* Двигатель */}
          <div className="form-group">
              <label className="required-field">Двигатель</label>
              <input
                type="text"
                id="engine"
                name="engine"
                value={formData.engine}
                onChange={handleChange}
                required
            />
            </div>

            {/* Мощность */}
          <div className="form-group">
                <label className="required-field">Мощность</label>
              <input
                type="number"
                id="horsepower"
                name="horsepower"
                value={formData.horsepower}
                onChange={handleChange}
                required
            />
            </div>

            {/* Тип трансмиссии */}
            <div className="form-group">
              <label className="required-field">Тип трансмиссии</label>
              <select
                id="transmission"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                required
          >
            <option value="">Выберите тип трансмиссии</option>
            <option value="Manual">Механическая</option>
            <option value="Automatic">Автоматическая</option>
            <option value="CVT">Роботизированная</option>
          </select>
         </div>

         {/* Тип привода */}
         <div className="form-group">
              <label className="required-field">Тип привода</label>
              <select
                id="drive_type"
                name="drive_type"
                value={formData.drive_type}
                onChange={handleChange}
                required
          >
            <option value="">Выберите тип привода</option>
            <option value="FWD">Передний</option>
            <option value="RWD">Задний</option>
            <option value="4WD">Полный</option>
            <option value="AWD">Всеприводный</option>
          </select>
         </div>

         {/* Цвет */}
         <div className="form-group">
              <label className="required-field">Цвет</label>
              <select
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
          >
            <option value="">Выберите цвет</option>
            <option value="red">Красный</option>
            <option value="blue">Синий</option>
            <option value="green">Зеленый</option>
            <option value="yellow">Желтый</option>
            <option value="black">Черный</option>
            <option value="white">Белый</option>
            <option value="gray">Серый</option>
            <option value="brown">Коричневый</option>
            <option value="orange">Оранжевый</option>
            <option value="purple">Фиолетовый</option>
            <option value="pink">Розовый</option>
            <option value="gold">Золотой</option>
            <option value="silver">Серебряный</option>
          </select>
         </div>

          {/* Тип кузова*/}
          <div className="form-group">
              <label className="required-field">Тип кузова</label>
              <select
                id="body_type"
                name="body_type"
                value={formData.body_type}
                onChange={handleChange}
                required
          >
            <option value="">Выберите тип кузова</option>
            <option value="sedan">Седан</option>
            <option value="hatchback">Хэтчбек</option>
            <option value="coupe">Купе</option>
            <option value="cabriolet">Кабриолет</option>
            <option value="suv">Внедорожник</option>
            <option value="minivan">Минивэн</option>
            <option value="pickup">Пикап</option>
            <option value="van">Фургон</option>
            <option value="wagon">Универсал</option>
          </select>
         </div>

         {/* Описание */}
         <div className="form-group">
              <label className="required-field">Описание</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
            />
            </div>

            <div className="form-group">
            <label className="required-field">Изображение</label>
              <input
              src={Array.isArray(formData.image_url) ? formData.image_url[0] : formData.image_url} 
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                required={!editingCar} // Обязательно только при создании
              />
         </div>
         </div>
         <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="submit-btn">
              {editingCar ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
            </form>
          </div>
        </div>
  );
}

export default AddCar;