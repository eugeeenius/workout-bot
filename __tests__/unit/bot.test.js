const TelegramBot = require('node-telegram-bot-api');
const UserService = require('../../src/services/user-service');
const COMMANDS = require('../../src/enum/commands');
const getUserFixture = require('../../__fixtures__/user');
const getMessageFixture = require('../../__fixtures__/message');
const getWorkoutFixture = require('../../__fixtures__/workout');
const SET_MY_COMMANDS_PAYLOADS = require('../../src/enum/set-my-commands-payloads');
const WorkoutService = require('../../src/services/workout-service');
const WorkoutBot = require('../../src/bot');
const MESSAGES = require('../../src/messages');
const MUSCLE_GROUPS = require('../../src/enum/muscle-group');
const WORKOUT_TYPES = require('../../src/enum/workout-types');

jest.mock('node-telegram-bot-api');

describe('Bot messages', () => {
  const workoutBotPrototype = WorkoutBot.prototype;
  const telegramBotPrototype = TelegramBot.prototype;

  describe('sendMessage', () => {
    const ID = 9999;
    const TEXT = 'text';
    const FORM = { someField: 'value' };

    telegramBotPrototype.sendMessage = jest.fn();

    test('Wrong arguments', () => {
      const INCORRECT_ID = 'incorrect';
      const INCORRECT_MESSAGE = null;

      workoutBotPrototype.sendMessage(INCORRECT_ID, {});
      workoutBotPrototype.sendMessage(ID, INCORRECT_MESSAGE);

      expect(telegramBotPrototype.sendMessage).not.toHaveBeenCalled();
    });

    test('Correct arguments', () => {
      const MESSAGE = { text: TEXT, form: FORM };

      workoutBotPrototype.sendMessage(ID, MESSAGE);

      expect(telegramBotPrototype.sendMessage).toHaveBeenCalledWith(ID, TEXT, FORM);
    });

    test('Without form', () => {
      const MESSAGE = { text: TEXT };

      workoutBotPrototype.sendMessage(ID, MESSAGE);

      expect(telegramBotPrototype.sendMessage).toHaveBeenCalledWith(ID, TEXT);
    });

    test('Without text', () => {
      const MESSAGE = { form: FORM };

      workoutBotPrototype.sendMessage(ID, MESSAGE);

      expect(telegramBotPrototype.sendMessage).toHaveBeenCalledWith(ID, FORM);
    });
  });

  describe('Message callbacks', () => {
    const CHAT_ID = 123;
    let MESSAGE, USER;
    const getUserSpy = jest.spyOn(UserService, 'getUser');
    const setMyCommandsSpy = jest.spyOn(telegramBotPrototype, 'setMyCommands');
    const getMyCommandsSpy = jest.spyOn(telegramBotPrototype, 'getMyCommands');

    describe('onStart', () => {
      beforeAll(() => {
        USER = getUserFixture();
        MESSAGE = getMessageFixture();
        MESSAGE.chat.id = CHAT_ID;
        USER.chatId = CHAT_ID;
        MESSAGE.text = COMMANDS.START;
      });

      test('User registered', async () => {
        getUserSpy.mockResolvedValue(USER);

        await workoutBotPrototype.onStart(CHAT_ID);

        expect(setMyCommandsSpy).not.toHaveBeenCalled();
      });

      test('User unregistered', async () => {
        const INITIAL_COMMANDS = [
          SET_MY_COMMANDS_PAYLOADS[COMMANDS.START]
        ];
        getUserSpy.mockResolvedValue(null);
        getMyCommandsSpy.mockReturnValue(INITIAL_COMMANDS);
        workoutBotPrototype.sendMessage = jest.fn();

        await workoutBotPrototype.onStart(CHAT_ID);

        expect(setMyCommandsSpy).toHaveBeenCalledWith([
          SET_MY_COMMANDS_PAYLOADS[COMMANDS.START],
          SET_MY_COMMANDS_PAYLOADS[COMMANDS.START_WORKOUT]
        ]);

        expect(workoutBotPrototype.sendMessage).toHaveBeenCalledWith(CHAT_ID, MESSAGES.START_WORKOUT);
      });
    });

    describe('onStartWorkout', () => {
      WorkoutService.createWorkout = jest.fn();

      beforeAll(() => {
        USER = getUserFixture();
        MESSAGE = getMessageFixture();
        MESSAGE.chat.id = CHAT_ID;
        USER.chatId = CHAT_ID;
        MESSAGE.text = COMMANDS.START_WORKOUT;
      });

      test('User registered', async () => {
        const WORKOUT = getWorkoutFixture();
        WorkoutService.createWorkout = jest.fn().mockReturnValue(WORKOUT)
        getUserSpy.mockResolvedValue(USER);
        await workoutBotPrototype.onStartWorkout(CHAT_ID);

        expect(WorkoutService.createWorkout).toHaveBeenCalledWith(CHAT_ID);
      });

      test('User unregistered', async () => {
        workoutBotPrototype.onStart = jest.fn();
        await workoutBotPrototype.onStartWorkout(CHAT_ID);

        expect(WorkoutService.createWorkout).toHaveBeenCalled();
        expect(workoutBotPrototype.onStart).not.toHaveBeenCalled();
      });
    });
  });

  describe('getWorkoutDescription', () => {
    const WORKOUT = getWorkoutFixture();

    test('Chest workout', () => {
      WORKOUT.muscleGroup = MUSCLE_GROUPS.CHEST;
      WORKOUT.type = WORKOUT_TYPES.MAX_AMOUNT;

      expect(workoutBotPrototype.getWorkoutDescription(WORKOUT)).toBe('Тренировка грудных с максимальным количеством повторений');
    });

    test('Back workout', () => {
      WORKOUT.muscleGroup = MUSCLE_GROUPS.BACK;
      WORKOUT.type = WORKOUT_TYPES.SHORT_PAUSES;

      expect(workoutBotPrototype.getWorkoutDescription(WORKOUT)).toBe('Тренировка спины с перерывами по 15 секунд');
    });
  });
});
