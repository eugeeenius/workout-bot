const WorkoutBot = require('../../src/bot');
const getMessageFixture = require('../../__fixtures__/message');
const getUserFixture = require('../../__fixtures__/user');
const MESSAGES = require('../../src/messages');
const COMMANDS = require('../../src/enum/commands');
const SET_MY_COMMANDS_PAYLOADS = require('../../src/enum/set-my-commands-payloads');
const EVENTS = require('../../src/enum/bot-events');
const { startBot, stopBot } = require('../start-bot');


describe('WorkoutBot', () => {
  const workoutBotPrototype = WorkoutBot.prototype;
  let bot;

  afterAll(async () => {
    await stopBot();
  });

  describe('WorkoutBot initialization', () => {
    test('setMyCommands have been called', async () => {
      const setMyCommandsSpy = jest.spyOn(workoutBotPrototype, 'setMyCommands');

      bot = await startBot();

      expect(setMyCommandsSpy).toHaveBeenCalledWith([
        SET_MY_COMMANDS_PAYLOADS[COMMANDS.START]
      ]);
    }, 30000);
  });

  describe('Message callbacks', () => {
    const CHAT_ID = 123;
    let MESSAGE, USER;

    jest.setTimeout(30000);

    beforeEach(() => {
      USER = getUserFixture();
      MESSAGE = getMessageFixture();
      MESSAGE.chat.id = CHAT_ID;
      USER.chatId = CHAT_ID;
    });

    afterEach(() => {
      expect.hasAssertions();
    });

    beforeAll(async () => {
      bot = await startBot();
    });

    test('No message object', (done) => {
      workoutBotPrototype.sendMessage = jest.fn();

      bot.emit(EVENTS.MESSAGE, null);
      bot.emit(EVENTS.CALLBACK_QUERY, null);

      setTimeout(() => {
        expect(workoutBotPrototype.sendMessage).toHaveBeenCalledTimes(2);
        expect(workoutBotPrototype.sendMessage).toHaveBeenCalledWith(MESSAGES.ERROR);
        done();
      }, 1000)
    });

    test('On /start', (done) => {
      MESSAGE.text = COMMANDS.START;
      MESSAGE.data = COMMANDS.START;
      workoutBotPrototype.onStart = jest.fn();

      bot.emit(EVENTS.MESSAGE, MESSAGE);
      bot.emit(EVENTS.CALLBACK_QUERY, { message: MESSAGE, data: COMMANDS.START });

      setTimeout(() => {
        expect(workoutBotPrototype.onStart).toHaveBeenCalledTimes(2);
        done();
      }, 1000)
    })

    test('On /start_workout', (done) => {
      MESSAGE.text = COMMANDS.START_WORKOUT;
      MESSAGE.data = COMMANDS.START_WORKOUT;
      workoutBotPrototype.onStartWorkout = jest.fn();

      bot.emit(EVENTS.MESSAGE, MESSAGE);
      bot.emit(EVENTS.CALLBACK_QUERY, { message: MESSAGE, data: COMMANDS.START_WORKOUT });

      setTimeout(() => {
        expect(workoutBotPrototype.onStartWorkout).toHaveBeenCalledWith(CHAT_ID);
        expect(workoutBotPrototype.onStartWorkout).toHaveBeenCalledTimes(2);
        done();
      }, 1000)
    })
  });
});
