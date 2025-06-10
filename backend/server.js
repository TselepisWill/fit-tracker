require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes, Op } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.SQLITE_STORAGE || './fitness.sqlite',
  logging: false
});

const User = sequelize.define('User', {
  username:         { type: DataTypes.STRING,  allowNull: false, unique: true },
  email:            { type: DataTypes.STRING,  allowNull: false, unique: true },
  password:         { type: DataTypes.STRING,  allowNull: false },
  dailyCalorieGoal: { type: DataTypes.INTEGER, defaultValue: 2000 }
}, {
  timestamps: true
});

const Workout = sequelize.define('Workout', {
  description: { type: DataTypes.STRING,  allowNull: false },
  duration:    { type: DataTypes.INTEGER, defaultValue: 0 },
  date:        { type: DataTypes.DATE,    defaultValue: Sequelize.NOW }
}, {
  timestamps: true
});

const Meal = sequelize.define('Meal', {
  description: { type: DataTypes.STRING,  allowNull: false },
  calories:    { type: DataTypes.INTEGER, defaultValue: 0 },
  protein:     { type: DataTypes.INTEGER, defaultValue: 0 },
  carbs:       { type: DataTypes.INTEGER, defaultValue: 0 },
  fats:        { type: DataTypes.INTEGER, defaultValue: 0 },
  date:        { type: DataTypes.DATE,    defaultValue: Sequelize.NOW }
}, {
  timestamps: true
});

User.hasMany(Workout, { foreignKey: 'userId' });
Workout.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Meal, { foreignKey: 'userId' });
Meal.belongsTo(User, { foreignKey: 'userId' });

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Authentication required' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};


app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: 'Username, email and password are required' });

    const existing = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] }
    });
    if (existing)
      return res.status(400).json({ error: 'Username or email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        dailyCalorieGoal: user.dailyCalorieGoal
      },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        dailyCalorieGoal: user.dailyCalorieGoal
      },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(authenticate);


app.post('/api/workouts', async (req, res) => {
  try {
    const { description, duration = 0, date = new Date() } = req.body;
    const workout = await Workout.create({
      userId: req.user.id,
      description,
      duration,
      date
    });
    res.status(201).json(workout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await Workout.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/meals', async (req, res) => {
  try {
    const { description, calories = 0, protein = 0, carbs = 0, fats = 0 } = req.body;
    if (!description)
      return res.status(400).json({ error: 'Meal description is required' });

    const meal = await Meal.create({
      userId: req.user.id,
      description,
      calories,
      protein,
      carbs,
      fats,
      date: new Date()
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const totals = await Meal.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('calories')), 'calories'],
        [sequelize.fn('SUM', sequelize.col('protein')),  'protein'],
        [sequelize.fn('SUM', sequelize.col('carbs')),    'carbs'],
        [sequelize.fn('SUM', sequelize.col('fats')),     'fats']
      ],
      where: {
        userId: req.user.id,
        date: { [Op.gte]: todayStart }
      },
      raw: true
    });

    const { calories: c = 0, protein: p = 0, carbs: cb = 0, fats: f = 0 } = totals[0] || {};

    res.status(201).json({
      meal,
      dailyTotals: { calories: c, protein: p, carbs: cb, fats: f },
      remainingCalories: req.user.dailyCalorieGoal - c
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/meals', async (req, res) => {
  try {
    const { date } = req.query;
    const where = { userId: req.user.id };

    if (date) {
      const start = new Date(date);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);
      where.date = { [Op.gte]: start, [Op.lt]: end };
    }

    const meals = await Meal.findAll({
      where,
      order: [['date', 'DESC']]
    });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/profile', async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalWorkouts, totalMeals, nutritionStats] = await Promise.all([
      Workout.count({ where: { userId: req.user.id } }),
      Meal.count({ where: { userId: req.user.id } }),
      Meal.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('calories')), 'calories'],
          [sequelize.fn('SUM', sequelize.col('protein')),  'protein']
        ],
        where: {
          userId: req.user.id,
          date: { [Op.gte]: todayStart }
        },
        raw: true
      })
    ]);

    const { calories = 0, protein = 0 } = nutritionStats[0] || {};

    res.json({
      username: req.user.username,
      email: req.user.email,
      dailyCalorieGoal: req.user.dailyCalorieGoal,
      totalWorkouts,
      totalMeals,
      todayCalories: calories,
      todayProtein: protein
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('🗄️  SQLite connection established');
    await sequelize.sync();
    console.log('✅  Models synchronized');

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌  Unable to start server:', err);
  }
})();
