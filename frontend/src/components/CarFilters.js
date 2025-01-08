import React, { useState } from 'react';
import './CarFilters.css';

function CarFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    brand: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
    sort: 'created_at',
    order: 'DESC'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      brand: '',
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
      sort: 'created_at',
      order: 'DESC'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="filters-container">
      <h3>Фильтры</h3>
      
      <div className="filter-group">
        <label>Марка:</label>
        <input
          type="text"
          name="brand"
          value={filters.brand}
          onChange={handleChange}
          placeholder="Введите марку"
        />
      </div>

      <div className="filter-group">
        <label>Цена:</label>
        <div className="price-range">
          <input
            type="number"
            name="priceMin"
            value={filters.priceMin}
            onChange={handleChange}
            placeholder="От"
          />
          <input
            type="number"
            name="priceMax"
            value={filters.priceMax}
            onChange={handleChange}
            placeholder="До"
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Год выпуска:</label>
        <div className="year-range">
          <input
            type="number"
            name="yearMin"
            value={filters.yearMin}
            onChange={handleChange}
            placeholder="От"
          />
          <input
            type="number"
            name="yearMax"
            value={filters.yearMax}
            onChange={handleChange}
            placeholder="До"
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Сортировка:</label>
        <select name="sort" value={filters.sort} onChange={handleChange}>
          <option value="created_at">По дате добавления</option>
          <option value="price">По цене</option>
          <option value="year">По году выпуска</option>
        </select>
        <select name="order" value={filters.order} onChange={handleChange}>
          <option value="DESC">По убыванию</option>
          <option value="ASC">По возрастанию</option>
        </select>
      </div>

      <button className="clear-filters-btn" onClick={clearFilters}>
        Сбросить фильтры
      </button>
    </div>
  );
}

export default CarFilters;