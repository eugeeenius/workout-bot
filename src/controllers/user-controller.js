const UserService = require('../services/user-service');

class UserController {
  async register(chatId) {
    if (typeof chatId !== 'number') return;
    await UserService.createUser(chatId);
  }
}

module.exports = new UserController();
