const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['fruit', 'vegetable', 'protein', 'grain', 'dairy', 'fat', 'other']
  },
  nutritionPer100g: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 }
  }
});

// Pre-populate common foods if empty
foodSchema.statics.initialize = async function() {
  const count = await this.countDocuments();
  if (count === 0) {
    await this.insertMany([
      {
        name: 'Chicken Breast',
        category: 'protein',
        nutritionPer100g: {
          calories: 165,
          protein: 31,
          carbs: 0,
          fats: 3.6
        }
      },
      {
        name: 'Brown Rice',
        category: 'grain',
        nutritionPer100g: {
          calories: 111,
          protein: 2.6,
          carbs: 23,
          fats: 0.9
        }
      }
      // Add more foods...
    ]);
    console.log('Food database initialized with default items');
  }
};

module.exports = mongoose.model('Food', foodSchema);