const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer'); // Установите: npm install multer
const fs = require('fs'); // Добавьте эту строку!
const app = express();

// Настройка CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
require('dotenv').config();
app.use(express.urlencoded({ extended: true }));
// Раздача статических файлов
app.use('/images/cars', express.static(path.join(__dirname, 'public/images/cars')));
app.use('/uploads', express.static('uploads'));
// Обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Произошла ошибка на сервере',
    error: err.message
  });
});
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Autosalon',
  password: 'postgres', // Ваш пароль от PostgreSQL
  port: 5432
});

// JWT Secret Key
const JWT_SECRET = 'your-secret-key'; // В продакшене используйте переменные окружения

// Middleware для обработки ошибок
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Middleware для проверки авторизации
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Не авторизован' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Недействительный токен' });
  }
};
// Middleware для логирования запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
};

// Сначала объявляем функцию fileFilter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Не поддерживаемый формат файла'), false);
  }
};

// Затем настраиваем storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Изменяем путь на frontend/public/images/cars
    const dir = path.join(__dirname, '../frontend/public/images/cars');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
    },
    filename: function (req, file, cb) {
      // Генерируем уникальное имя файла
      const originalName = file.originalname;
      cb(null, originalName);
    }
  });

// И только потом создаем upload с использованием fileFilter
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Регистрация
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Проверяем, существует ли пользователь
    const userExists = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        message: 'Пользователь с таким именем или email уже существует'
      });
    }

    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создаем нового пользователя
    const newUser = await pool.query(
      `INSERT INTO users (username, email, password_hash, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, role`,
      [username, email, hashedPassword, 'user']
    );

    // Создаем JWT токен
    const token = jwt.sign(
      {
        userId: newUser.rows[0].id,
        username: newUser.rows[0].username,
        role: newUser.rows[0].role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Отправляем ответ
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.rows[0].id,
        username: newUser.rows[0].username,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      message: 'Ошибка при регистрации пользователя'
    });
  }
});

// Вход
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for user:', username); // Для отладки

    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    const user = userResult.rows[0];

    if (!user) {
      console.log('User not found'); // Для отладки
      return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      console.log('Invalid password'); // Для отладки
      return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
    }

    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username,
        role: user.role
      },
      'your_jwt_secret',
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', username); // Для отладки

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});





// Тестовый endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Защищенный endpoint для проверки авторизации
app.get('/api/profile', authMiddleware, async (req, res) => {
  res.json(req.userData);
});

// Изменяем запросы к БД для работы с автомобилями вместо игр
app.get('/api/cars', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cars');
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Добавление автомобиля в избранное
app.post('/api/user/favorites', authMiddleware, async (req, res) => {
  try {
    const { car_id } = req.body;
    const userId = req.userData.userId;

    const result = await pool.query(
      'INSERT INTO user_favorites (user_id, car_id) VALUES ($1, $2) RETURNING *',
      [userId, car_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding to favorites:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Получение списка избранных автомобилей пользователя
app.get('/api/user/favorites', authMiddleware, async (req, res) => {
  try {
    const userId = req.userData.userId;
    const result = await pool.query(`
      SELECT c.* 
      FROM cars c
      INNER JOIN user_favorites uf ON c.id = uf.car_id
      WHERE uf.user_id = $1
    `, [userId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Удаление автомобиля из избранного
app.delete('/api/user/favorites/:carId', authMiddleware, async (req, res) => {
  try {
    const { carId } = req.params;
    const userId = req.userData.userId;

    await pool.query(
      'DELETE FROM user_favorites WHERE user_id = $1 AND car_id = $2',
      [userId, carId]
    );

    res.json({ message: 'Successfully removed from favorites' });
  } catch (err) {
    console.error('Error removing from favorites:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Получение списка автомобилей
app.get('/api/cars', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, 
             array_agg(cs.*) as specifications
      FROM cars c
      LEFT JOIN car_specifications cs ON c.id = cs.car_id
      GROUP BY c.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching cars:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Получение детальной информации об автомобиле
app.get('/api/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const carQuery = `
      SELECT c.*, cs.*
      FROM cars c
      LEFT JOIN car_specifications cs ON c.id = cs.car_id
      WHERE c.id = $1
    `;
    const result = await pool.query(carQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Автомобиль не найден' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching car details:', err);
    res.status(500).json({ error: 'Database error' });
  }
});



app.post('/api/cars', upload.single('image'), async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      price,
      mileage,
      engine,
      horsepower,
      transmission,
      drive_type,
      color,
      body_type,
      description,
      image_url
    } = req.body;

    // Получаем имя файла из загруженного изображения
    const image_filename = req.file ? req.file.filename : null;

    const query = `
      INSERT INTO cars (
        brand, model, year, price, mileage, engine,
        horsepower, transmission, drive_type, color,
        body_type, description, image_url, image_filename
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      brand,
      model,
      year,
      price,
      mileage,
      engine,
      horsepower,
      transmission,
      drive_type,
      color,
      body_type,
      description,
      image_url,
      image_filename
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).json({
      message: 'Ошибка при добавлении автомобиля',
      error: error.message
    });
  }
});

// Обработка обновления автомобиля
app.put('/api/cars/:id', upload.single('image'), async (req, res) => {
  try {
    const carId = req.params.id;
    const {
      brand,
      model,
      year,
      price,
      mileage,
      engine,
      horsepower,
      transmission,
      drive_type,
      color,
      body_type,
      description,
      image_filename
    } = req.body;

    console.log(carId);
    console.log(req.body.image_filename);
    // Получаем имя файла из загруженного изображения
    let filename = req.file ? req.file.filename : null;
    let final_image_url = `{/images/cars/${filename}}`
     if (!filename) {
      filename = req.body.image_filename;
      final_image_url = null;
     }
      console.log(filename);
      console.log(final_image_url);

    const query = `
      UPDATE cars
      SET
        brand = $1,
        model = $2,
        year = $3,
        price = $4,
        mileage = $5,
        engine = $6,
        horsepower = $7,
        transmission = $8,
        drive_type = $9,
        color = $10,
        body_type = $11,
        description = $12,
        image_url = $13,
        image_filename = $14
      WHERE id = $15
      RETURNING *
    `;

    const values = [
      brand,
      model,
      year,
      price,
      mileage,
      engine,
      horsepower,
      transmission,
      drive_type,
      color,
      body_type,
      description,
      final_image_url,
      filename,
      carId
    ];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({
      message: 'Ошибка при обновлении автомобиля',
      error: error.message
    });
  }
});
    

// Endpoint для удаления игры
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM cars WHERE id = $1', [id]);
    res.json({ message: 'Автомобиль успешно удален' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ message: 'Ошибка при удалении автомобиля' });
  }
});


// Запуск сервера
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
