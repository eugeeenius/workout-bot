const MESSAGES = require("../messages");
const WorkoutService = require('../services/workout-service');
const BotService = require('../services/bot-service');

class WorkoutController {
  async startWorkout(chatId) {
    const lastWorkout = await WorkoutService.getLastWorkout(chatId);
    if (!lastWorkout) {
      await this.sendMuscleGroupChoice(chatId);
      return;
    }

    await WorkoutService.createWorkout(chatId);
  }

  async sendMuscleGroupChoice(chatId) {
    if (typeof chatId !== 'number') return;
    await BotService.sendMessage(chatId, MESSAGES.MUSCLE_GROUP_CHOICE)
  }
}

module.exports = new WorkoutController();
