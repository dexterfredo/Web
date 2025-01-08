import React from 'react';
import { FaCar, FaUsers, FaAward, FaHandshake } from 'react-icons/fa';
import './about.css';

function About() {
  return (
    <div className="about-container">
      {/* Главный баннер */}
      <div className="about-hero">
        <h1>О компании AutoSalon</h1>
        <p>Ваш надежный партнер в мире автомобилей с 2010 года</p>
      </div>

      {/* Основная информация */}
      <section className="about-section">
        <h2>Наша история</h2>
        <p>
          AutoSalon начал свою деятельность в 2010 году как небольшой дилерский центр. 
          За прошедшие годы мы выросли в одну из крупнейших компаний на автомобильном рынке России, 
          сохранив при этом индивидуальный подход к каждому клиенту.
        </p>
      </section>

      {/* Преимущества */}
      <section className="advantages-section">
        <h2>Наши преимущества</h2>
        <div className="advantages-grid">
          <div className="advantage-card">
            <FaCar className="advantage-icon" />
            <h3>Широкий выбор</h3>
            <p>Более 500 автомобилей различных марок в наличии</p>
          </div>
          <div className="advantage-card">
            <FaUsers className="advantage-icon" />
            <h3>Профессионализм</h3>
            <p>Команда опытных специалистов с многолетним стажем</p>
          </div>
          <div className="advantage-card">
            <FaAward className="advantage-icon" />
            <h3>Гарантия качества</h3>
            <p>Все автомобили проходят тщательную проверку</p>
          </div>
          <div className="advantage-card">
            <FaHandshake className="advantage-icon" />
            <h3>Надежность</h3>
            <p>Более 10000 довольных клиентов за время работы</p>
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3>12+</h3>
            <p>Лет на рынке</p>
          </div>
          <div className="stat-item">
            <h3>500+</h3>
            <p>Автомобилей в наличии</p>
          </div>
          <div className="stat-item">
            <h3>10000+</h3>
            <p>Довольных клиентов</p>
          </div>
          <div className="stat-item">
            <h3>20+</h3>
            <p>Брендов</p>
          </div>
        </div>
      </section>

      {/* Наша миссия */}
      <section className="mission-section">
        <h2>Наша миссия</h2>
        <div className="mission-content">
          <p>
            Мы стремимся сделать процесс покупки автомобиля максимально простым, 
            прозрачным и приятным для каждого клиента. Наша цель - не просто продать 
            автомобиль, а помочь вам найти именно тот, который идеально подойдет 
            под ваши потребности и образ жизни.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;