const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/fitnessDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Mongoose Models
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: String,
  dailyCalorieGoal: Number
}));

const Workout = mongoose.model('Workout', new mongoose.Schema({
  userId: Number,
  description: String,
  duration: Number,
  date: { type: Date, default: Date.now }
}));

const Meal = mongoose.model('Meal', new mongoose.Schema({
  userId: Number,
  description: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number,
  date: { type: Date, default: Date.now }
}));

// Initialize with sample data (optional)
async function initializeData() {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.create({ id: 1, username: 'ramel', email: 'ramel@example.com', dailyCalorieGoal: 2000 });
    console.log('Sample user created');
  }
}
initializeData();

// --- WORKOUT ENDPOINTS ---
app.post('/api/workouts', async (req, res) => {
  try {
    const { userId, description, duration } = req.body;
    if (!userId || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const workout = await Workout.create({
      userId,
      description,
      duration: duration || 0
    });
    
    res.json({ success: true, workout });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/workouts/:userId', async (req, res) => {
  try {
    const userWorkouts = await Workout.find({ userId: req.params.userId }).sort('-date');
    res.json(userWorkouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ENHANCED MEAL ENDPOINTS ---
app.post('/api/meals', async (req, res) => {
  try {
    const { userId, description, calories, protein, carbs, fats } = req.body;
    
    if (!userId || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const meal = await Meal.create({
      userId,
      description,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0
    });

    // Calculate daily totals
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const dailyTotals = await Meal.aggregate([
      {
        $match: {
          userId: Number(userId),
          date: { $gte: todayStart }
        }
      },
      {
        $group: {
          _id: null,
          calories: { $sum: "$calories" },
          protein: { $sum: "$protein" },
          carbs: { $sum: "$carbs" },
          fats: { $sum: "$fats" }
        }
      }
    ]);

    const user = await User.findOne({ id: userId });
    const totals = dailyTotals[0] || { calories: 0, protein: 0, carbs: 0, fats: 0 };
    
    res.json({ 
      success: true, 
      meal,
      dailyTotals: totals,
      remainingCalories: user ? user.dailyCalorieGoal - totals.calories : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/meals/:userId', async (req, res) => {
  try {
    const { date } = req.query;
    const query = { userId: req.params.userId };
    
    if (date) {
      const dateObj = new Date(date);
      const nextDay = new Date(dateObj);
      nextDay.setDate(dateObj.getDate() + 1);
      
      query.date = {
        $gte: dateObj,
        $lt: nextDay
      };
    }
    
    const userMeals = await Meal.find(query).sort('-date');
    res.json(userMeals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ENHANCED PROFILE ENDPOINTS ---
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ id: Number(req.params.userId) });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const stats = await Promise.all([
      Workout.countDocuments({ userId: user.id }),
      Meal.countDocuments({ userId: user.id }),
      Meal.aggregate([
        {
          $match: {
            userId: user.id,
            date: { $gte: todayStart }
          }
        },
        {
          $group: {
            _id: null,
            calories: { $sum: "$calories" },
            protein: { $sum: "$protein" }
          }
        }
      ])
    ]);

    const todayStats = stats[2][0] || { calories: 0, protein: 0 };
    
    res.json({
      username: user.username,
      email: user.email,
      dailyCalorieGoal: user.dailyCalorieGoal,
      totalWorkouts: stats[0],
      totalMeals: stats[1],
      todayCalories: todayStats.calories,
      todayProtein: todayStats.protein
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- IMPROVED NUTRITION ANALYSIS ---
app.post('/api/analyze-meal', async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ error: 'Description required' });

    // Mock AI analysis (replace with actual OpenAI integration)
    const mockResults = {
      "bowl of rice": { calories: 200, protein: 4, carbs: 45, fats: 0.5 },
      "chicken breast": { calories: 165, protein: 31, carbs: 0, fats: 3.6 },
      "salad": { calories: 50, protein: 3, carbs: 8, fats: 1 }
    };

    const result = mockResults[description.toLowerCase()] || {
      calories: Math.floor(Math.random() * 300) + 100,
      protein: Math.floor(Math.random() * 20) + 5,
      carbs: Math.floor(Math.random() * 40) + 10,
      fats: Math.floor(Math.random() * 15) + 3
    };

    res.json({
      name: description,
      ...result,
      confidence: mockResults[description.toLowerCase()] ? 0.9 : 0.6
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend API running at http://localhost:${PORT}`));