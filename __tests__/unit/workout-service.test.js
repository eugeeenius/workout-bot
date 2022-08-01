const WORKOUT_TYPES = require('../../src/enum/workout-types');
const WorkoutService = require('../../src/services/workout-service');

describe('Get random workout type', () => {
  test('previousWorkouts is not an Array', () => {
    expect(WorkoutService.getWorkoutType(null)).toBeUndefined();
  });

  test('Without previous workouts', () => {
    expect(WorkoutService.getWorkoutType()).toBeDefined();
  });

  test('User has uncompleted types in current workout series', () => {
    const PREVIOUS_WORKOUTS = [
      { workoutType: WORKOUT_TYPES.SHORT_PAUSES },
      { workoutType: WORKOUT_TYPES.DELAYS }
    ];

    expect(WorkoutService.getWorkoutType(PREVIOUS_WORKOUTS)).toBe(WORKOUT_TYPES.MAX_AMOUNT);
  });
});
