require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitnessDB')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dailyCalorieGoal: { type: Number, default: 2000 },
  createdAt: { type: Date, default: Date.now }
}));

const Workout = mongoose.model('Workout', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  duration: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
}));

const Meal = mongoose.model('Meal', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
}));

// Auth Middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Authentication required' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Public Routes

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        dailyCalorieGoal: user.dailyCalorieGoal
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        dailyCalorieGoal: user.dailyCalorieGoal
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Use authenticate middleware for all routes below
app.use(authenticate);

// Workouts routes
app.post('/api/workouts', async (req, res) => {
  try {
    const workout = new Workout({
      user: req.user._id,
      description: req.body.description,
      duration: req.body.duration || 0,
      date: req.body.date || new Date()
    });
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort('-date');
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Meals routes
app.post('/api/meals', async (req, res) => {
  try {
    const { description, calories = 0, protein = 0, carbs = 0, fats = 0 } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Meal description is required' });
    }

    const meal = new Meal({
      user: req.user._id,
      description,
      calories,
      protein,
      carbs,
      fats,
      date: new Date()
    });

    await meal.save();

    // Calculate today's totals
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const dailyTotals = await Meal.aggregate([
      { $match: { user: req.user._id, date: { $gte: todayStart } } },
      {
        $group: {
          _id: null,
          calories: { $sum: '$calories' },
          protein: { $sum: '$protein' },
          carbs: { $sum: '$carbs' },
          fats: { $sum: '$fats' }
        }
      }
    ]);

    const totals = dailyTotals[0] || { calories: 0, protein: 0, carbs: 0, fats: 0 };

    res.status(201).json({
      meal,
      dailyTotals: totals,
      remainingCalories: req.user.dailyCalorieGoal - totals.calories
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/meals', async (req, res) => {
  try {
    const { date } = req.query;
    const query = { user: req.user._id };

    if (date) {
      const dateObj = new Date(date);
      const nextDay = new Date(dateObj);
      nextDay.setDate(dateObj.getDate() + 1);
      query.date = { $gte: dateObj, $lt: nextDay };
    }

    const meals = await Meal.find(query).sort('-date');
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profile stats
app.get('/api/profile', async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [workoutCount, mealCount, nutritionStats] = await Promise.all([
      Workout.countDocuments({ user: req.user._id }),
      Meal.countDocuments({ user: req.user._id }),
      Meal.aggregate([
        { $match: { user: req.user._id, date: { $gte: todayStart } } },
        {
          $group: {
            _id: null,
            calories: { $sum: '$calories' },
            protein: { $sum: '$protein' }
          }
        }
      ])
    ]);

    const todayNutrition = nutritionStats[0] || { calories: 0, protein: 0 };

    res.json({
      username: req.user.username,
      email: req.user.email,
      dailyCalorieGoal: req.user.dailyCalorieGoal,
      totalWorkouts: workoutCount,
      totalMeals: mealCount,
      todayCalories: todayNutrition.calories,
      todayProtein: todayNutrition.protein
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
