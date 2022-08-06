const TelegramBot = require('node-telegram-bot-api');
const UserService = require('./services/user-service');
const WorkoutService = require('./services/workout-service');
const MESSAGES = require('./messages');
const {
  SET_MY_COMMANDS_PAYLOADS,
  WORKOUT_DESCRIPTIONS,
  MUSCLE_GROUPS,
  COMMANDS,
  EVENTS
} = require('./enum');

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
      if (!msg?.chat) {
        await this.sendMessage(MESSAGES.ERROR);
        return;
      }
      await this.onMessage(msg.chat.id, msg.text);
    });
    this.on(EVENTS.CALLBACK_QUERY, async (query) => {
      if (!query?.message) {
        await this.sendMessage(MESSAGES.ERROR);
        return;
      }
      try {
        await this.onMessage(query.message.chat.id, query.data);
      } catch(e) {
        console.log(e);
      }
    });

    this.emit(EVENTS.READY);
  }

  async disconnect() {
    await this.stopPolling({ cancel: true });
  }

  async onMessage(chatId, command) {
    switch (command) {
      case COMMANDS.START:
        await this.onStart(chatId);
        break;
      case COMMANDS.START_WORKOUT:
        await this.onStartWorkout(chatId);
        break;
    }
  }

  async onStart(chatId) {
    const candidate = await UserService.getUser(chatId);

    if (!candidate) {
      await UserService.findOrCreate(chatId);

      const commands = await this.getMyCommands();
      await this.setMyCommands([
        ...commands,
        SET_MY_COMMANDS_PAYLOADS[COMMANDS.START_WORKOUT]
      ]);

      await this.sendMessage(chatId, MESSAGES.START_WORKOUT);
    }
  }

  async onStartWorkout(chatId) {
    const user = await UserService.getUser(chatId);
    if (!user) {
      await this.onStart(chatId);
      return;
    }

    const workout = await WorkoutService.createWorkout(chatId);
    if (!workout) {
      return;
    }

    const text = this.getWorkoutDescription(workout);
    await this.sendMessage(chatId, { text });
  }

  async sendMessage(chatId, message) {
    if (typeof chatId !== 'number' || !message) return;
    const args = [chatId, message.text, message.form].filter(arg => arg !== undefined);
    await super.sendMessage(...args);
  }

  getWorkoutDescription(workout) {
    const muscleGroupText = workout.muscleGroup === MUSCLE_GROUPS.CHEST ? 'грудных' : 'спины';
    const description = WORKOUT_DESCRIPTIONS[workout.type];
    return `Тренировка ${muscleGroupText} ${description}`;
  }
}

module.exports = WorkoutBot;
