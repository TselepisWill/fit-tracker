const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  description: { type: String, required: true },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
