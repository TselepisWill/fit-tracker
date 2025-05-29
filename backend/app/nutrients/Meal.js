const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // <-- change here if user is ObjectId
    required: true,
    ref: 'User'  // optional ref if you want population later
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
