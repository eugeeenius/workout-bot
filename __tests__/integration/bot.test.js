const WorkoutBot = require('../../src/bot');
const UserService = require('../../src/services/user-service');
const message = require('../../__fixtures__/message')();
const user = require('../../__fixtures__/user')();
const MESSAGES = require('../../src/messages');
const COMMANDS = require('../../src/enum/commands');
const EVENTS = require('../../src/enum/bot-events');

function createBot() {
  return new WorkoutBot(process.env.API_TOKEN, { polling: true });
}

describe('WorkoutBot', () => {
  const workoutBotPrototype = WorkoutBot.prototype;

  describe('WorkoutBot initialization', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test('init fn to be called', () => {
      workoutBotPrototype.init = jest.fn();

      new WorkoutBot(process.env.API_TOKEN, { polling: true });

      expect(workoutBotPrototype.init).toHaveBeenCalled();
    });

    test('All methods inside init fn have been called', async () => {
      workoutBotPrototype.on = jest.fn();
      workoutBotPrototype.emit = jest.fn();
      workoutBotPrototype.setMyCommands = jest.fn();

      const bot = createBot();

      bot.on(EVENTS.READY, () => {
        expect(workoutBotPrototype.setMyCommands).toHaveBeenCalled();
        expect(workoutBotPrototype.on).toHaveBeenCalledTimes(2);
        expect(workoutBotPrototype.emit).toHaveBeenCalled();
      });
    });
  });

  describe('Bot messages', () => {
    const bot = createBot();
    const telegramBot = Object.getPrototypeOf(Object.getPrototypeOf(bot));

    describe('sendMessage', () => {
      const ID = 9999;
      const TEXT = 'text';
      const FORM = { someField: 'value' };

      telegramBot.sendMessage = jest.fn();

      afterEach(() => {
        jest.clearAllMocks();
      });


      test('Wrong arguments', () => {
        const INCORRECT_ID = 'incorrect';
        const INCORRECT_MESSAGE = null;

        bot.sendMessage(INCORRECT_ID, {});
        bot.sendMessage(ID, INCORRECT_MESSAGE);

        expect(telegramBot.sendMessage).not.toHaveBeenCalled();
      });

      test('Correct arguments', () => {
        const MESSAGE = { text: TEXT, form: FORM };

        bot.sendMessage(ID, MESSAGE);

        expect(telegramBot.sendMessage).toHaveBeenCalledWith(ID, TEXT, FORM);
      });

      test('Without form', () => {
        const MESSAGE = { text: TEXT };

        bot.sendMessage(ID, MESSAGE);

        expect(telegramBot.sendMessage).toHaveBeenCalledWith(ID, TEXT);
      });

      test('Without text', () => {
        const MESSAGE = { form: FORM };

        bot.sendMessage(ID, MESSAGE);

        expect(telegramBot.sendMessage).toHaveBeenCalledWith(ID, FORM);
      });
    });

    describe('Message callbacks', () => {
      describe(COMMANDS.START_WORKOUT, () => {
        const CHAT_ID = 123;
        message.text = COMMANDS.START_WORKOUT;
        message.chat.id = CHAT_ID;
        user.chatId = CHAT_ID;

        test('onStartWorkout called', () => {
          workoutBotPrototype.onStartWorkout = jest.fn();

          bot.emit(EVENTS.MESSAGE, {});

          bot.on(EVENTS.MESSAGE, () => {
            expect(workoutBotPrototype.onStartWorkout).toHaveBeenCalledTimes(1);
          });
        });

        test('onStartWorkout', async () => {
          UserService.getUser = jest.fn();

          await bot.onStartWorkout(message);

          bot.on(EVENTS.MESSAGE, () => {
            expect(UserService.getUser).toHaveBeenCalledWith(CHAT_ID);
          });
        });

        test('User unregistered', () => {
          workoutBotPrototype.sendMessage = jest.fn();

          bot.emit(EVENTS.MESSAGE, message);

          bot.on(EVENTS.MESSAGE, () => {
            expect(workoutBotPrototype.sendMessage).toHaveBeenCalledWith(CHAT_ID, MESSAGES.MUSCLE_GROUP_CHOICE);
          });
        });

        // test('User registered', () => {
        //   jest.spyOn(UserService, 'getUser').mockImplementation(() => user);
        //
        //   bot.emit(EVENTS.MESSAGE, message);
        //
        //   bot.on(EVENTS.MESSAGE, () => {
        //     expect(workoutBotPrototype.sendMessage).toHaveBeenCalledWith(CHAT_ID, MESSAGES.MUSCLE_GROUP_CHOICE);
        //   });
        // });
      });
    });
  });
});
