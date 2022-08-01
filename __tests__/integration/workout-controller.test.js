const MUSCLE_GROUP = require('../../src/enum/muscle-group');
const WorkoutModel = require('../../src/models/workout');
const WorkoutService = require('../../src/services/workout-service');
const WorkoutController = require('../../src/controllers/workout-controller');

describe('Workout controller', () => {
  describe('Start workout', () => {
    const CHAT_ID = 231232132;
    const findLastWorkout = jest.spyOn(WorkoutModel, 'findOne');

    test('Is initial workout', async () => {
      findLastWorkout.mockImplementation(() => null);
      WorkoutService.createWorkout = jest.fn();
      WorkoutController.sendMuscleGroupChoice = jest.fn();

      await WorkoutController.startWorkout(CHAT_ID);

      expect(findLastWorkout).toHaveBeenCalledWith({ where: { chatId: CHAT_ID }, order: [['id', 'DESC']] });
      expect(WorkoutController.sendMuscleGroupChoice).toHaveBeenCalledWith(CHAT_ID);
      expect(WorkoutService.createWorkout).not.toHaveBeenCalled();
    });

    test('Is not initial workout', async () => {
      findLastWorkout.mockImplementation(() => ({ muscleGroup: MUSCLE_GROUP.CHEST }));
      WorkoutService.createWorkout = jest.fn();

      await WorkoutController.startWorkout(CHAT_ID);

      expect(findLastWorkout).toHaveBeenCalled();
      expect(WorkoutService.createWorkout).toHaveBeenCalledWith(CHAT_ID);
    });
  });
});
