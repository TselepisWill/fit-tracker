const Meal = require('../models/Meal');

exports.createMeal = async (req, res) => {
  try {
    const { userId, description, calories, protein, carbs, fats } = req.body;
    
    const meal = await Meal.create({
      userId,
      description,
      calories,
      protein,
      carbs,
      fats
    });

    res.status(201).json({
      success: true,
      meal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getUserMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.params.userId })
                          .sort('-date')
                          .limit(50);

    res.json({
      success: true,
      count: meals.length,
      meals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};