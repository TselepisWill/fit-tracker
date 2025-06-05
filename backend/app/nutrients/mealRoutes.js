const express = require('express');
const router = express.Router();
const Meal = require('./models/Meal'); // path to your Meal model

// POST /api/meals - create a new meal
router.post('/meals', async (req, res) => {
  try {
    const { userId, description, calories, protein, carbs, fats } = req.body;
    if (!userId || !description) {
      return res.status(400).json({ error: 'User ID and description required' });
    }

    const meal = new Meal({
      userId,
      description,
      calories,
      protein,
      carbs,
      fats,
    });

    await meal.save();
    res.status(201).json({ meal });
  } catch (error) {
    console.error('Error creating meal:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/meals/:userId - get all meals for a user
router.get('/meals/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const meals = await Meal.find({ userId }).sort({ date: -1 });
    res.json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
