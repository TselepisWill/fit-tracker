const Meal = require('../models/Meal');
const openaiService = require('../services/openaiService');

exports.logMeal = async (req, res) => {
  try {
    const { description, calories, protein, carbs, fats } = req.body;
    const userId = req.user.id;

    const meal = await Meal.create({
      userId,
      description,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fats: Number(fats)
    });

    const dailyTotals = await Meal.getDailyTotals(userId);
    const user = await User.findById(userId);

    res.json({
      success: true,
      meal,
      dailyTotals,
      remainingCalories: user.dailyCalorieGoal - dailyTotals.calories
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMeals = async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    const userId = req.user.id;
    
    let query = { userId };
    
    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      query.date = { $gte: dayStart, $lte: dayEnd };
    } else if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const meals = await Meal.find(query).sort('-date');
    res.json(meals);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.analyzeMeal = async (req, res) => {
  try {
    const analysis = await openaiService.analyzeMeal(
      req.body.description,
      req.body.quantity,
      req.body.unit
    );
    res.json({ success: true, ...analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};