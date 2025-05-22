const express = require('express');
const router = express.Router();
const {
  createMeal,
  getUserMeals
} = require('../controllers/mealController');

router.post('/', createMeal);
router.get('/:userId', getUserMeals);

module.exports = router;