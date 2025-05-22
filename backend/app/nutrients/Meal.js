const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  calories: {
    type: Number,
    default: 0,
    min: 0
  },
  protein: {
    type: Number,
    default: 0,
    min: 0
  },
  carbs: {
    type: Number,
    default: 0,
    min: 0
  },
  fats: {
    type: Number,
    default: 0,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Meal', mealSchema);