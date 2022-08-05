const UserModel = require('../models/user');

class UserService {
  async createUser(chatId) {
    return UserModel.findOrCreate({ where: { chatId } });
  }

  async getUser(chatId) {
    return UserModel.findOne({ where: { chatId } });
  }

  async getAllWorkouts(chatId) {
    return (await this.getUser(chatId))?.workouts;
  }
}

module.exports = new UserService();
