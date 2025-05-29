const express = require('express');
const router = express.Router();
const {
  createMeal,
  getUserMeals
} = require('../controllers/mealController');

// Create a new meal
router.post('/', createMeal);

// Get meals for a user (optionally add date filter with query params later)
router.get('/user/:userId', getUserMeals);

module.exports = router;
