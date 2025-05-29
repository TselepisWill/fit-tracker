const Meal = require('../models/Meal');

exports.createMeal = async (req, res) => {
  try {
    const { userId, description, calories, protein, carbs, fats } = req.body;

    if (!userId || !description) {
      return res.status(400).json({
        success: false,
        error: 'userId and description are required'
      });
    }

    const meal = await Meal.create({
      userId,
      description,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0
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
