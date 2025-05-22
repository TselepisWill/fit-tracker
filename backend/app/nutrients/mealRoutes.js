const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const authMiddleware = require('../middleware/auth');

// Protect all meal routes
router.use(authMiddleware);

router.post('/', mealController.logMeal);
router.get('/', mealController.getMeals);
router.post('/analyze', mealController.analyzeMeal);

module.exports = router;