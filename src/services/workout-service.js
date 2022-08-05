const WorkoutModel = require('../models/workout');
const WORKOUT_TYPES = require('../enum/workout-types');
const MUSCLE_GROUPS = require('../enum/muscle-group');

class WorkoutService {
  async createWorkout(chatId) {
    const lastWorkout = await this.getLastWorkout(chatId);
    const workoutType = this.getWorkoutType(lastWorkout?.type);
    const muscleGroup = lastWorkout?.muscleGroup === MUSCLE_GROUPS.CHEST
      ? MUSCLE_GROUPS.BACK
      : MUSCLE_GROUPS.CHEST;

    await WorkoutModel.create({
      chatId,
      muscleGroup,
      workoutType
    });
  }

  getWorkoutType(previousWorkoutType) {
    const typesOrder = [WORKOUT_TYPES.MAX_AMOUNT, WORKOUT_TYPES.DELAYS, WORKOUT_TYPES.SHORT_PAUSES];
    const defaultType = WORKOUT_TYPES.MAX_AMOUNT;
    const previousIndex = typesOrder.indexOf(previousWorkoutType);

    if (!typesOrder.includes(previousWorkoutType) || previousIndex === typesOrder.length - 1) {
      return defaultType;
    }

    return typesOrder[previousIndex + 1];
  }

  async getLastWorkout(chatId) {
    return WorkoutModel.findOne({
      where: { chatId },
      order: [['createdAt', 'DESC']]
    });
  }

  async addApproach(chatId, reps) {
    const currentWorkout = await this.getLastWorkout(chatId);
    if (!currentWorkout) return;
    await currentWorkout.update({ approaches: [...currentWorkout.approaches, reps] });
  }
}

module.exports = new WorkoutService();
