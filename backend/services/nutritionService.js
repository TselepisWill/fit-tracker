const Meal = require('../app/nutrients/Meal');
const User = require('../app/users/User');

class NutritionService {
  async getDailySummary(userId, date = new Date()) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const [summary, user] = await Promise.all([
      Meal.aggregate([
        { $match: { user: userId, date: { $gte: start, $lte: end } } },
        { $unwind: '$foods' },
        { $group: {
            _id: null,
            calories: { $sum: '$foods.nutrition.calories' },
            protein: { $sum: '$foods.nutrition.protein' },
            carbs: { $sum: '$foods.nutrition.carbs' },
            fats: { $sum: '$foods.nutrition.fats' },
            meals: { $sum: 1 }
          }
        }
      ]),
      User.findById(userId).select('dailyCalorieGoal')
    ]);

    const totals = summary[0] || { calories: 0, protein: 0, carbs: 0, fats: 0, meals: 0 };

    return {
      ...totals,
      remainingCalories: user.dailyCalorieGoal - totals.calories,
      goal: user.dailyCalorieGoal
    };
  }

  async getWeeklySummary(userId) {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);

    return Meal.aggregate([
      { $match: { user: userId, date: { $gte: start } } },
      { $unwind: '$foods' },
      { $group: {
          _id: { $dayOfWeek: '$date' },
          day: { $first: { $dayOfWeek: '$date' } },
          calories: { $sum: '$foods.nutrition.calories' },
          protein: { $sum: '$foods.nutrition.protein' },
          meals: { $sum: 1 }
        }
      },
      { $sort: { day: 1 } }
    ]);
  }
}

module.exports = new NutritionService();