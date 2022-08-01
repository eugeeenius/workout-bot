const UserController = require('../../src/controllers/user-controller');
const UserModel = require('../../src/models/user');
const WorkoutService = require('../../src/services/workout-service');

describe('UserController', () => {
  describe('User registration', () => {
    const findOrCreateUser = jest.spyOn(UserModel, 'findOrCreate');

    afterEach(async () => {
      findOrCreateUser.mockClear();
    });

    test('Wrong chat id type', async () => {
      const STR_CHAT_ID = '2';
      WorkoutService.getWorkoutType = jest.fn();

      await UserController.register(STR_CHAT_ID);

      expect(findOrCreateUser).not.toHaveBeenCalled();
      expect(WorkoutService.getWorkoutType)
    });

    test('User is unregistered', async () => {
      const UNREGISTERED_USER_ID = 54321;

      await UserController.register(UNREGISTERED_USER_ID);
      const user = await UserModel.findByPk(UNREGISTERED_USER_ID);
      await user.destroy();


      expect(user).toBeDefined();
      expect(findOrCreateUser).toHaveBeenCalledWith({ where: { chatId: UNREGISTERED_USER_ID } });
    });

    test('User already registered', async () => {
      const REGISTERED_USER_ID = 12345;

      const user = await UserModel.create({ chatId: REGISTERED_USER_ID });
      await UserController.register(REGISTERED_USER_ID);
      await user.destroy();

      expect(findOrCreateUser).toHaveBeenCalledTimes(1);
    });
  });
});
