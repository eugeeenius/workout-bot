const User = require('../models/user')

class UserController {
  async register(chatId) {
    const candidate = await User.findByPk(chatId);
    if (!candidate) {
      const user = await User.create({ chatId });
      await user.save();
    }
  }
}

module.exports = UserController;
