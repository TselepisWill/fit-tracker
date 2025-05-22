const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let workouts = []; 
let meals = [];    

app.post('/api/workouts', (req, res) => {
  const { userId, description } = req.body;
  if (!userId || !description) {
    return res.status(400).json({ error: 'Missing userId or description' });
  }
  const workout = { id: Date.now(), userId, description };
  workouts.push(workout);
  res.json({ success: true, workout });
});

app.get('/api/workouts/:userId', (req, res) => {
  const { userId } = req.params;
  const userWorkouts = workouts.filter(w => w.userId == userId);
  res.json(userWorkouts);
});

app.get('/api/profile/:userId', (req, res) => {
  const { userId } = req.params;

  const user = {
    id: 1,
    username: 'ramel',
    email: 'ramel@example.com'
  };

  const totalWorkouts = workouts.filter(w => w.userId == userId).length;
  const totalMeals = meals.filter(m => m.userId == userId).length;

  res.json({
    username: user.username,
    email: user.email,
    totalWorkouts,
    totalMeals
  });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend API running at http://localhost:${PORT}`));

