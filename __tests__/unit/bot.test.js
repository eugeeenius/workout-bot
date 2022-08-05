const TelegramBot = require('node-telegram-bot-api');
const UserService = require('../../src/services/user-service');
const COMMANDS = require('../../src/enum/commands');
const getUserFixture = require('../../__fixtures__/user');
const getMessageFixture = require('../../__fixtures__/message');
const SET_MY_COMMANDS_PAYLOADS = require('../../src/enum/set-my-command-payloads');
const WorkoutService = require('../../src/services/workout-service');
const WorkoutBot = require('../../src/bot');

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

        await workoutBotPrototype.onStart(MESSAGE);

        expect(setMyCommandsSpy).not.toHaveBeenCalled();
      });

      test('User unregistered', async () => {
        const INITIAL_COMMANDS = [
          SET_MY_COMMANDS_PAYLOADS[COMMANDS.START]
        ];
        getUserSpy.mockResolvedValue(null);
        getMyCommandsSpy.mockReturnValue(INITIAL_COMMANDS);

        await workoutBotPrototype.onStart(MESSAGE);

        expect(setMyCommandsSpy).toHaveBeenCalledWith([
          SET_MY_COMMANDS_PAYLOADS[COMMANDS.START],
          SET_MY_COMMANDS_PAYLOADS[COMMANDS.START_WORKOUT]
        ]);
      });
    });

    describe('onStartWorkout', () => {
      WorkoutService.createWorkout = jest.fn()

      beforeAll(() => {
        USER = getUserFixture();
        MESSAGE = getMessageFixture();
        MESSAGE.chat.id = CHAT_ID;
        USER.chatId = CHAT_ID;
        MESSAGE.text = COMMANDS.START_WORKOUT;
      });

      test('User unregistered', async () => {
        getUserSpy.mockResolvedValue(null);

        await workoutBotPrototype.onStartWorkout(MESSAGE);

        expect(WorkoutService.createWorkout).not.toHaveBeenCalled();

      })

      test('User registered', async () => {
        getUserSpy.mockResolvedValue(USER);

        await workoutBotPrototype.onStartWorkout(MESSAGE);

        expect(WorkoutService.createWorkout).toHaveBeenCalledWith(CHAT_ID);
      });
    });
  });
});
