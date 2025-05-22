const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory database
let workouts = [];
let meals = [];
let users = [
  { id: 1, username: 'ramel', email: 'ramel@example.com', dailyCalorieGoal: 2000 }
];

// --- WORKOUT ENDPOINTS ---
app.post('/api/workouts', (req, res) => {
  const { userId, description, duration } = req.body;
  if (!userId || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const workout = { 
    id: Date.now(), 
    userId, 
    description,
    duration: duration || 0,
    date: new Date().toISOString()
  };
  workouts.push(workout);
  res.json({ success: true, workout });
});

app.get('/api/workouts/:userId', (req, res) => {
  const userWorkouts = workouts.filter(w => w.userId == req.params.userId);
  res.json(userWorkouts);
});

// --- MEAL ENDPOINTS ---
app.post('/api/meals', (req, res) => {
  const { userId, description, calories, protein, carbs, fats } = req.body;
  
  if (!userId || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const meal = { 
    id: Date.now(),
    userId,
    description,
    calories: Number(calories) || 0,
    protein: Number(protein) || 0,
    carbs: Number(carbs) || 0,
    fats: Number(fats) || 0,
    date: new Date().toISOString()
  };

  meals.push(meal);
  
  // Calculate daily totals for response
  const dailyTotals = meals
    .filter(m => m.userId === userId && m.date.includes(new Date().toISOString().split('T')[0]))
    .reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein
    }), { calories: 0, protein: 0 });

  res.json({ 
    success: true, 
    meal,
    dailyTotals,
    remainingCalories: users.find(u => u.id == userId).dailyCalorieGoal - dailyTotals.calories
  });
});

app.get('/api/meals/:userId', (req, res) => {
  const { date } = req.query; // Optional date filter
  let userMeals = meals.filter(m => m.userId == req.params.userId);
  
  if (date) {
    userMeals = userMeals.filter(m => m.date.includes(date));
  }

  res.json(userMeals);
});

// --- PROFILE ENDPOINTS ---
app.get('/api/profile/:userId', (req, res) => {
  const user = users.find(u => u.id == Number(req.params.userId));
  if (!user) return res.status(404).json({ error: 'User not found' });

  const today = new Date().toISOString().split('T')[0];
  
  const stats = {
    totalWorkouts: workouts.filter(w => w.userId == user.id).length,
    totalMeals: meals.filter(m => m.userId == user.id).length,
    todayCalories: meals
      .filter(m => m.userId == user.id && m.date.includes(today))
      .reduce((sum, meal) => sum + meal.calories, 0),
    todayProtein: meals
      .filter(m => m.userId == user.id && m.date.includes(today))
      .reduce((sum, meal) => sum + meal.protein, 0)
  };

  res.json({
    username: user.username,
    email: user.email,
    dailyCalorieGoal: user.dailyCalorieGoal,
    ...stats
  });
});

// --- NUTRITION ANALYSIS ---
app.post('/api/analyze-meal', (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'Description required' });

  // Mock AI analysis - replace with actual OpenAI integration
  const mockResults = {
    "bowl of rice": { calories: 200, protein: 4, carbs: 45, fats: 0.5 },
    "chicken breast": { calories: 165, protein: 31, carbs: 0, fats: 3.6 }
  };

  const result = mockResults[description.toLowerCase()] || {
    calories: 300,
    protein: 15,
    carbs: 30,
    fats: 10
  };

  res.json({
    name: description,
    ...result,
    confidence: mockResults[description.toLowerCase()] ? 0.9 : 0.6
  });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend API running at http://localhost:${PORT}`));