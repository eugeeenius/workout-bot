const WORKOUT_TYPES = require('../../src/enum/workout-types');
const MUSCLE_GROUP = require('../../src/enum/muscle-group');
const WorkoutModel = require('../../src/models/workout');
const WorkoutService = require('../../src/services/workout-service');

const WORKOUT = require('../../__fixtures__/workout')();
const CHAT_ID = 888888882;
const WORKOUT_TYPE = WORKOUT_TYPES.DELAYS;
WORKOUT.chatId = CHAT_ID;
WORKOUT.muscleGroup = MUSCLE_GROUP.CHEST;
WORKOUT.type = WORKOUT_TYPE;

jest.mock('../../src/models/workout');

describe('WorkoutService', () => {
  describe('getWorkoutType', () => {
    test('Wrong previous workout type', () => {
      expect(WorkoutService.getWorkoutType('WRONG')).toBe(WORKOUT_TYPES.MAX_AMOUNT);
    });

    test('User has uncompleted types in current workout series', () => {
      expect(WorkoutService.getWorkoutType(WORKOUT_TYPES.DELAYS)).toBe(WORKOUT_TYPES.SHORT_PAUSES);
    });

    test('Last workout in series', () => {
      expect(WorkoutService.getWorkoutType(WORKOUT_TYPES.SHORT_PAUSES)).toBe(WORKOUT_TYPES.MAX_AMOUNT);
    });
  });

  describe('createWorkout', () => {
    const createModelSpy = jest.spyOn(WorkoutModel, 'create');

    test('User has previous workouts', async () => {
      WorkoutService.getLastWorkout = jest.fn().mockResolvedValue(WORKOUT);

      await WorkoutService.createWorkout(CHAT_ID);

      expect(createModelSpy).toHaveBeenCalledWith({
        chatId: CHAT_ID,
        muscleGroup: MUSCLE_GROUP.BACK,
        type: WORKOUT_TYPES.SHORT_PAUSES
      });
    });

    test('No previous workouts', async () => {
      WorkoutService.getLastWorkout = jest.fn().mockResolvedValue(null);

      await WorkoutService.createWorkout(CHAT_ID);

      expect(createModelSpy).toHaveBeenCalledWith({
        chatId: CHAT_ID,
        muscleGroup: MUSCLE_GROUP.CHEST,
        type: WORKOUT_TYPES.MAX_AMOUNT
      });
    });

    test('Has unfinished workout', async () => {
      WORKOUT.done = false;
      WorkoutService.getLastWorkout = jest.fn().mockResolvedValue(WORKOUT);

      expect(createModelSpy).not.toHaveBeenCalled();
    });
  });

});

