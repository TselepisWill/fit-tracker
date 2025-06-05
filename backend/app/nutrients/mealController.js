const Meal = require('../models/Meal');

exports.createMeal = async (req, res) => {
  try {
    const meal = await Meal.create({
      user: req.user._id,
      description: req.body.description,
      macros: req.body.macros
    });
    res.status(201).json({ meal });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user._id })
      .sort('-createdAt');
    res.json(meals);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};