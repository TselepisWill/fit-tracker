const Meal = require('../models/Meal');
const OpenAIService = require('../services/openaiService');

exports.createMeal = async (req, res) => {
  try {
    const { userId, description, quantity, unit } = req.body;

    if (!userId || !description) {
      return res.status(400).json({ success: false, error: 'Missing required fields: userId and description are required.' });
    }

    // Get nutrition info from OpenAI
    const nutrition = await OpenAIService.analyzeMeal(description, quantity, unit);

    const meal = await Meal.create({
      userId,
      description,
      calories: nutrition.calories,
      protein: nutrition.protein_g,
      carbs: nutrition.carbs_g,
      fats: nutrition.fats_g,
      date: new Date()
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
