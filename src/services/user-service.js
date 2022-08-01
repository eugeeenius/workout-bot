const UserModel = require('../models/user');

class UserService {
  async createUser(chatId) {
    try {
      await UserModel.findOrCreate({ where: { chatId } });
    } catch(e) {
      console.log(e);
    }
  }

  async getUser(chatId) {
    return UserModel.findOne({ where: { chatId } });
  }

  async getAllWorkouts(chatId) {
    return (await this.getUser(chatId))?.workouts;
  }
}

module.exports = new UserService();
