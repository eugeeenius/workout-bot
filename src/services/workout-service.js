const WorkoutModel = require('../models/workout');
const WORKOUT_TYPES = require('../enum/workout-types');

class WorkoutService {
  async createWorkout(chatId) {
    if (typeof chatId !== 'number') return;

    const muscleGroup = this.getMuscleGroup();
    const workoutType = this.getWorkoutType();
    if (!workoutType || !muscleGroup) return;

    await WorkoutModel.create({ chatId, muscleGroup, workoutType });
  }

  getWorkoutType(previousWorkouts = []) {
    if (!Array.isArray(previousWorkouts)) return;

    const types = Object.values(WORKOUT_TYPES);

    return types.reduce((acc, type) => {
      if (!previousWorkouts.some(workout => workout.workoutType === type)) {
        acc = type;
      }
      return acc;
    }, undefined);
  }

  getMuscleGroup(previousWorkouts = []) {
    if (!Array.isArray(previousWorkouts)) return;

    const types = Object.values(WORKOUT_TYPES);

    return types.reduce((acc, type) => {
      if (!previousWorkouts.some(workout => workout.workoutType === type)) {
        acc = type;
      }
      return acc;
    }, undefined);
  }

  async getLastWorkout(chatId) {
    if (typeof chatId !== 'number') return;
    return WorkoutModel.findOne({ where: { chatId }, order: [['id', 'DESC']] });
  }
}

module.exports = new WorkoutService();
