const UserController = require('../../src/controllers/user-controller');
const UserModel = require('../../src/models/user');
const sequelize = require('../../src/db');

describe('UserController', () => {
  const controller = new UserController();

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('User registration', () => {
    let user;
    const createUser = jest.spyOn(UserModel, 'create');

    afterEach(async () => {
      createUser.mockClear();
      await user.destroy();
    });

    test('User is unregistered', async () => {
      const UNREGISTERED_USER_ID = 54321;

      await controller.register(UNREGISTERED_USER_ID);
      user = await UserModel.findByPk(UNREGISTERED_USER_ID);

      expect(user).toBeDefined();
      expect(createUser).toHaveBeenCalledWith({ chatId: UNREGISTERED_USER_ID });
    });

    test('User already registered', async () => {
      const REGISTERED_USER_ID = 12345;

      user = await UserModel.create({ chatId: REGISTERED_USER_ID });
      await controller.register(REGISTERED_USER_ID);

      expect(createUser).toHaveBeenCalledTimes(1);
    });
  });
});
