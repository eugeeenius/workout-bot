const TelegramBot = require('node-telegram-bot-api');
const UserService = require('./services/user-service');
const WorkoutService = require('./services/workout-service');
const SET_MY_COMMANDS_PAYLOADS = require('./enum/set-my-command-payloads');
const COMMANDS = require('./enum/commands');
const MESSAGES = require('./messages');
const EVENTS = require('./enum/bot-events');

class WorkoutBot extends TelegramBot {
  constructor(token, options) {
    super(token, options);
  }

  async init() {
    await this.startPolling({ restart: true });

    await this.setMyCommands([
      SET_MY_COMMANDS_PAYLOADS[COMMANDS.START]
    ]);

    this.on(EVENTS.MESSAGE, async (msg) => {
      console.log(msg);
      if (!msg) {
        await this.sendMessage(MESSAGES.ERROR);
        return;
      }

      switch (msg.text) {
        case COMMANDS.START:
          await this.onStart(msg);
          break;
        case COMMANDS.START_WORKOUT:
          await this.onStartWorkout(msg);
          break;
      }
    });

    this.emit(EVENTS.READY);
  }

  async disconnect() {
    await this.stopPolling({ cancel: true });
  }

  async onStart(msg) {
    const chatId = msg.chat.id
    const candidate = await UserService.getUser(chatId);
    if (!candidate) {
      const commands = await this.getMyCommands();
      await UserService.createUser(chatId);
      await this.setMyCommands([
        ...commands,
        SET_MY_COMMANDS_PAYLOADS[COMMANDS.START_WORKOUT]
      ]);
      await this.sendMessage(chatId, MESSAGES.START_WORKOUT);
    }
  }

  async onStartWorkout(msg) {
    const chatId = msg.chat.id
    const user = await UserService.getUser(chatId);

    if (!user) return;

    await WorkoutService.createWorkout(chatId);
  }

  async sendMessage(chatId, message) {
    if (typeof chatId !== 'number' || !message) return;
    const args = [chatId, message.text, message.form].filter(arg => arg !== undefined);
    await super.sendMessage(...args);
  }
}

module.exports = WorkoutBot;
